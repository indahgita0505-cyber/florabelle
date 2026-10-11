<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\CustomOrder;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();

        // 1. Total Pesanan Hari Ini
        $ordersToday = Order::whereDate('created_at', $today)->count();
        $customOrdersToday = CustomOrder::whereDate('created_at', $today)->count();
        $totalOrdersToday = $ordersToday + $customOrdersToday;

        $yesterday = Carbon::yesterday();
        $ordersYesterday = Order::whereDate('created_at', $yesterday)->count();
        $customOrdersYesterday = CustomOrder::whereDate('created_at', $yesterday)->count();
        $totalOrdersYesterday = $ordersYesterday + $customOrdersYesterday;
        $diffFromYesterday = $totalOrdersToday - $totalOrdersYesterday;
        $diffText = $diffFromYesterday >= 0 ? "+{$diffFromYesterday} dari kemarin" : "{$diffFromYesterday} dari kemarin";

        // 2. Pesanan Belum Diproses
        $unprocessedOrders = Order::where('status', 'pending')->count();
        $unprocessedCustom = CustomOrder::where('status', 'pending')->count();
        $totalUnprocessed = $unprocessedOrders + $unprocessedCustom;

        // 3. Estimasi Pendapatan (Bulan Ini)
        $incomeOrders = Order::where('payment_status', 'paid')->where('created_at', '>=', $startOfMonth)->sum('total');
        $incomeCustom = CustomOrder::where('payment_status', 'paid')->where('created_at', '>=', $startOfMonth)->sum('budget');
        $totalIncome = $incomeOrders + $incomeCustom;

        $formattedIncome = 'Rp ' . number_format($totalIncome, 0, ',', '.');

        $summaryCards = [
            [
                'title' => 'Total Pesanan Hari Ini',
                'value' => (string)$totalOrdersToday,
                'subtitle' => $diffText,
                'icon' => '🛍️',
                'color' => 'bg-blue-50 text-blue-600'
            ],
            [
                'title' => 'Pesanan Belum Diproses',
                'value' => (string)$totalUnprocessed,
                'subtitle' => 'Butuh tindakan',
                'icon' => '⚠️',
                'color' => 'bg-amber-50 text-amber-600'
            ],
            [
                'title' => 'Estimasi Pendapatan',
                'value' => $formattedIncome,
                'subtitle' => 'Bulan ini',
                'icon' => '💰',
                'color' => 'bg-emerald-50 text-emerald-600'
            ],
        ];

        // 4. Aktivitas Terkini (5 Pesanan Terbaru)
        $orders = Order::orderBy('created_at', 'desc')->take(5)->get()->map(function($o) {
            $statusText = $o->status;
            if ($o->status == 'pending') $statusText = 'Menunggu Pembayaran';
            else if ($o->status == 'processing') $statusText = 'Diproses';
            else if ($o->status == 'completed') $statusText = 'Selesai';
            else if ($o->status == 'cancelled') $statusText = 'Dibatalkan';
            
            $statusColor = 'bg-slate-100 text-slate-700';
            if ($o->status == 'pending') $statusColor = 'bg-amber-100 text-amber-700';
            else if ($o->status == 'processing') $statusColor = 'bg-blue-100 text-blue-700';
            else if ($o->status == 'completed') $statusColor = 'bg-emerald-100 text-emerald-700';
            else if ($o->status == 'cancelled') $statusColor = 'bg-red-100 text-red-700';

            return [
                'id' => 'FLR-' . str_pad($o->id, 4, '0', STR_PAD_LEFT),
                'name' => $o->customer_name,
                'status' => $statusText,
                'total' => 'Rp ' . number_format($o->total, 0, ',', '.'),
                'created_at' => $o->created_at,
                'statusColor' => $statusColor,
            ];
        });

        $customOrders = CustomOrder::orderBy('created_at', 'desc')->take(5)->get()->map(function($o) {
            $statusText = $o->status;
            if ($o->status == 'pending') $statusText = 'Menunggu Pembayaran';
            else if ($o->status == 'processing') $statusText = 'Diproses';
            else if ($o->status == 'completed') $statusText = 'Selesai';
            else if ($o->status == 'cancelled') $statusText = 'Dibatalkan';
            
            $statusColor = 'bg-slate-100 text-slate-700';
            if ($o->status == 'pending') $statusColor = 'bg-amber-100 text-amber-700';
            else if ($o->status == 'processing') $statusColor = 'bg-blue-100 text-blue-700';
            else if ($o->status == 'completed') $statusColor = 'bg-emerald-100 text-emerald-700';
            else if ($o->status == 'cancelled') $statusColor = 'bg-red-100 text-red-700';

            return [
                'id' => 'CUST-' . str_pad($o->id, 4, '0', STR_PAD_LEFT),
                'name' => $o->customer_name,
                'status' => $statusText,
                'total' => 'Rp ' . number_format($o->budget, 0, ',', '.'),
                'created_at' => $o->created_at,
                'statusColor' => $statusColor,
            ];
        });

        $recentOrders = $orders->concat($customOrders)
            ->sortByDesc('created_at')
            ->take(5)
            ->values()
            ->toArray();

        return Inertia::render('Admin/Dashboard', [
            'summaryCards' => $summaryCards,
            'recentOrders' => $recentOrders,
        ]);
    }
}
