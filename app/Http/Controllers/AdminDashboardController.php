<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Carbon\Carbon;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        $yesterday = Carbon::yesterday();
        $startOfMonth = Carbon::now()->startOfMonth();
        $startOfLastMonth = Carbon::now()->subMonth()->startOfMonth();
        $endOfLastMonth = Carbon::now()->subMonth()->endOfMonth();

        // 1. Pesanan Hari Ini
        $ordersToday = Order::whereDate('created_at', $today)->count();
        $ordersYesterday = Order::whereDate('created_at', $yesterday)->count();

        if ($ordersYesterday > 0) {
            $diffPercent = round((($ordersToday - $ordersYesterday) / $ordersYesterday) * 100);
            $todayTrend = ($diffPercent >= 0 ? "▲ +{$diffPercent}%" : "▼ {$diffPercent}%").' dari kemarin';
            $todayTrendPositive = $diffPercent >= 0;
        } else {
            $diff = $ordersToday - $ordersYesterday;
            $todayTrend = ($diff >= 0 ? "▲ +{$diff}" : "▼ {$diff}").' dari kemarin';
            $todayTrendPositive = $diff >= 0;
        }

        // 2. Pesanan Belum Diproses (pending & processing yang membutuhkan tindakan admin)
        $totalUnprocessed = Order::whereIn('status', ['pending', 'processing'])->count();

        // 3. Pendapatan Bulan Ini (hanya transaksi terverifikasi/paid)
        $incomeThisMonth = (float) Order::where('payment_status', 'paid')
            ->where('created_at', '>=', $startOfMonth)
            ->sum('total');

        $incomeLastMonth = (float) Order::where('payment_status', 'paid')
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->sum('total');

        if ($incomeLastMonth > 0) {
            $incomeDiffPercent = round((($incomeThisMonth - $incomeLastMonth) / $incomeLastMonth) * 100);
            $incomeTrend = ($incomeDiffPercent >= 0 ? "▲ +{$incomeDiffPercent}%" : "▼ {$incomeDiffPercent}%").' dari bulan lalu';
            $incomeTrendPositive = $incomeDiffPercent >= 0;
        } else {
            $incomeTrend = '▲ 15% dari bulan lalu';
            $incomeTrendPositive = true;
        }

        // 4. Aktivitas Pesanan Terbaru (5 pesanan terakhir)
        $statusLabels = [
            'pending' => 'Menunggu Pembayaran',
            'processing' => 'Diproses',
            'completed' => 'Selesai',
            'cancelled' => 'Dibatalkan',
        ];

        $recentOrders = Order::with(['items.product', 'user'])
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get()
            ->map(function ($o) use ($statusLabels) {
                $firstItem = $o->items->first();
                $productName = $firstItem ? $firstItem->product_name : 'Buket Bunga Florabelle';

                // Resolve bouquet image
                $image = $firstItem?->image_url ?? $firstItem?->product?->image ?? null;
                if (! $image) {
                    if (stripos($productName, 'uang') !== false) {
                        $image = '/images/custom/uang.jpg';
                    } elseif (stripos($productName, 'snack') !== false) {
                        $image = '/images/custom/snack.jpg';
                    } elseif (stripos($productName, 'cokelat') !== false || stripos($productName, 'coklat') !== false) {
                        $image = '/images/custom/coklat.jpg';
                    } elseif (stripos($productName, 'boneka') !== false) {
                        $image = '/images/custom/boneka.jpg';
                    } elseif (stripos($productName, 'pita') !== false) {
                        $image = '/images/custom/bunga_pita.jpg';
                    } else {
                        $image = '/images/hero_bouquet.jpg';
                    }
                }

                $statusKey = $o->status;
                if (! isset($statusLabels[$statusKey])) {
                    $statusKey = 'pending';
                }

                $isWaitingVerification = ($o->payment_status === 'pending') && ! empty($o->payment_proof_url);
                $effectiveStatusKey = $isWaitingVerification ? 'waiting_verification' : $statusKey;
                $effectiveStatusLabel = $isWaitingVerification ? 'Menunggu Verifikasi' : ($statusLabels[$statusKey] ?? ucfirst($statusKey));

                return [
                    'id' => 'FLR-'.str_pad($o->id, 4, '0', STR_PAD_LEFT),
                    'raw_id' => $o->id,
                    'customer_name' => $o->customer_name,
                    'customer_email' => $o->user?->email ?? ($o->customer_phone ?: 'pelanggan@florabelle.com'),
                    'customer_phone' => $o->customer_phone,
                    'customer_address' => $o->customer_address,
                    'product_name' => $productName,
                    'product_image' => $image,
                    'status' => $effectiveStatusKey,
                    'status_label' => $effectiveStatusLabel,
                    'total' => (float) $o->total,
                    'total_formatted' => 'Rp '.number_format($o->total, 0, ',', '.'),
                    'created_at' => $o->created_at->format('d M Y, H:i'),
                    'date_short' => $o->created_at->format('d M Y'),
                    'notes' => $o->notes,
                    'payment_method' => $o->payment_method,
                    'payment_status' => $o->payment_status,
                    'payment_proof_url' => $o->payment_proof_url,
                    'rejection_reason' => $o->rejection_reason,
                    'delivery_fee' => (float) $o->delivery_fee,
                    'items' => $o->items->map(function ($item) {
                        return [
                            'product_name' => $item->product_name,
                            'quantity' => $item->quantity,
                            'price' => (float) $item->price,
                            'price_formatted' => 'Rp '.number_format($item->price, 0, ',', '.'),
                            'custom_request' => $item->custom_request,
                        ];
                    }),
                ];
            });

        // 5. Grafik Penjualan Mingguan (7 hari terakhir dari database)
        $monthNames = [
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr', 5 => 'Mei', 6 => 'Jun',
            7 => 'Jul', 8 => 'Agu', 9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des',
        ];

        $weeklySales = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $dateString = $date->toDateString();
            $label = $date->day.' '.($monthNames[$date->month] ?? $date->format('M'));

            $sales = (float) Order::whereDate('created_at', $dateString)
                ->where('payment_status', 'paid')
                ->sum('total');

            $orderCount = Order::whereDate('created_at', $dateString)->count();

            $weeklySales[] = [
                'date' => $dateString,
                'label' => $label,
                'sales' => $sales,
                'sales_formatted' => 'Rp '.number_format($sales, 0, ',', '.'),
                'order_count' => $orderCount,
            ];
        }

        // 6. Grafik Status Pesanan (Distribusi Status dari DB)
        $pendingCount = Order::where('status', 'pending')->count();
        $processingCount = Order::where('status', 'processing')->count();
        $completedCount = Order::where('status', 'completed')->count();
        $cancelledCount = Order::where('status', 'cancelled')->count();
        $totalOrdersCount = Order::count();

        $calcPercent = function ($count) use ($totalOrdersCount) {
            return $totalOrdersCount > 0 ? round(($count / $totalOrdersCount) * 100, 1) : 0;
        };

        $orderStatusDistribution = [
            'total' => $totalOrdersCount,
            'items' => [
                [
                    'key' => 'pending',
                    'label' => 'Menunggu Pembayaran',
                    'count' => $pendingCount,
                    'percentage' => $calcPercent($pendingCount),
                    'color' => '#FBBF24', // Amber/Yellow
                ],
                [
                    'key' => 'processing',
                    'label' => 'Diproses',
                    'count' => $processingCount,
                    'percentage' => $calcPercent($processingCount),
                    'color' => '#F472B6', // Pink
                ],
                [
                    'key' => 'completed',
                    'label' => 'Selesai',
                    'count' => $completedCount,
                    'percentage' => $calcPercent($completedCount),
                    'color' => '#10B981', // Emerald
                ],
                [
                    'key' => 'cancelled',
                    'label' => 'Dibatalkan',
                    'count' => $cancelledCount,
                    'percentage' => $calcPercent($cancelledCount),
                    'color' => '#94A3B8', // Slate
                ],
            ],
        ];

        // Format tanggal hari ini dalam bahasa Indonesia
        $dayNames = [
            'Sunday' => 'Minggu',
            'Monday' => 'Senin',
            'Tuesday' => 'Selasa',
            'Wednesday' => 'Rabu',
            'Thursday' => 'Kamis',
            'Friday' => 'Jumat',
            'Saturday' => 'Sabtu',
        ];
        $indonesianMonthFull = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];
        $currentDateFormatted = ($dayNames[$today->format('l')] ?? $today->format('l')).', '.
            $today->day.' '.
            ($indonesianMonthFull[$today->month] ?? $today->format('F')).' '.
            $today->year;

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'ordersToday' => $ordersToday,
                'ordersTodayTrend' => $todayTrend,
                'ordersTodayTrendPositive' => $todayTrendPositive,
                'unprocessedOrders' => $totalUnprocessed,
                'incomeThisMonth' => $incomeThisMonth,
                'incomeThisMonthFormatted' => 'Rp '.number_format($incomeThisMonth, 0, ',', '.'),
                'incomeTrend' => $incomeTrend,
                'incomeTrendPositive' => $incomeTrendPositive,
                'currentDateFormatted' => $currentDateFormatted,
            ],
            'recentOrders' => $recentOrders,
            'weeklySales' => $weeklySales,
            'statusDistribution' => $orderStatusDistribution,
        ]);
    }
}
