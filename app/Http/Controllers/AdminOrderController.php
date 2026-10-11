<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminOrderController extends Controller
{
    /**
     * Display a listing of the orders.
     */
    public function index(Request $request)
    {
        $query = Order::with(['user', 'items.product']);

        // 1. Search Filter (ID, nama pelanggan, nomor hp, alamat)
        if ($request->filled('search')) {
            $search = trim($request->search);
            $cleanNumeric = preg_replace('/[^0-9]/', '', $search);

            $query->where(function ($q) use ($search, $cleanNumeric) {
                if (! empty($cleanNumeric)) {
                    $q->where('id', (int) $cleanNumeric);
                }
                $q->orWhere('customer_name', 'like', "%{$search}%")
                    ->orWhere('customer_phone', 'like', "%{$search}%")
                    ->orWhere('customer_address', 'like', "%{$search}%");
            });
        }

        // 2. Status Filter
        if ($request->filled('status') && $request->status !== 'all' && $request->status !== 'Semua Status') {
            $statusInput = $request->status;
            if ($statusInput === 'waiting_verification' || $statusInput === 'Menunggu Verifikasi') {
                $query->where('payment_status', 'pending')
                    ->whereNotNull('payment_proof_url')
                    ->where('payment_proof_url', '!=', '');
            } elseif ($statusInput === 'pending' || $statusInput === 'Menunggu Pembayaran') {
                $query->where('status', 'pending')
                    ->where(function ($q) {
                        $q->whereNull('payment_proof_url')
                            ->orWhere('payment_proof_url', '')
                            ->orWhere('payment_status', 'rejected');
                    });
            } else {
                $statusMap = [
                    'Diproses' => 'processing',
                    'Sedang Dirangkai' => 'processing',
                    'Selesai' => 'completed',
                    'Dibatalkan' => 'cancelled',
                ];
                $dbStatus = $statusMap[$statusInput] ?? $statusInput;
                $query->where('status', $dbStatus);
            }
        }

        // 3. Bouquet Type / Category Filter
        if ($request->filled('bouquet_type') && $request->bouquet_type !== 'all' && $request->bouquet_type !== 'Semua Jenis') {
            $bType = $request->bouquet_type;
            $query->whereHas('items', function ($q) use ($bType) {
                $q->where('product_name', 'like', "%{$bType}%");
            });
        }

        // 4. Date Filter
        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        // Pagination: 8 per page to match reference mockup
        $ordersPaginator = $query->orderBy('created_at', 'desc')
            ->paginate(8)
            ->withQueryString();

        $statusLabels = [
            'pending' => 'Menunggu Pembayaran',
            'processing' => 'Diproses',
            'completed' => 'Selesai',
            'cancelled' => 'Dibatalkan',
        ];

        $monthNames = [
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr', 5 => 'Mei', 6 => 'Jun',
            7 => 'Jul', 8 => 'Agu', 9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des',
        ];

        $ordersPaginator->through(function ($o) use ($statusLabels, $monthNames) {
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

            $stKey = $o->status;
            if (! isset($statusLabels[$stKey])) {
                $stKey = 'pending';
            }

            // Cek jika pesanan menunggu verifikasi struk
            $isWaitingVerification = ($o->payment_status === 'pending') && ! empty($o->payment_proof_url);
            $effectiveStatusKey = $isWaitingVerification ? 'waiting_verification' : $stKey;
            $effectiveStatusLabel = $isWaitingVerification ? 'Menunggu Verifikasi' : ($statusLabels[$stKey] ?? ucfirst($stKey));

            $dateMonth = $monthNames[$o->created_at->month] ?? $o->created_at->format('M');
            $dateFormatted = $o->created_at->day.' '.$dateMonth.' '.$o->created_at->year.' '.$o->created_at->format('H:i');
            $dateShort = $o->created_at->day.' '.$dateMonth.' '.$o->created_at->year;

            return [
                'id' => 'FLR-'.str_pad($o->id, 4, '0', STR_PAD_LEFT),
                'raw_id' => $o->id,
                'created_at' => $o->created_at->format('Y-m-d H:i:s'),
                'date' => $dateFormatted,
                'date_short' => $dateShort,
                'customer_name' => $o->customer_name,
                'customer_email' => $o->user?->email ?? ($o->customer_phone ?: '-'),
                'customer_phone' => $o->customer_phone,
                'customer_address' => $o->customer_address,
                'bouquet_name' => $productName,
                'bouquet_image' => $image,
                'total_price' => (float) $o->total,
                'total_formatted' => 'Rp '.number_format($o->total, 0, ',', '.'),
                'status' => $effectiveStatusKey,
                'raw_status' => $stKey,
                'status_label' => $effectiveStatusLabel,
                'payment_status' => $o->payment_status,
                'payment_method' => $o->payment_method,
                'payment_proof_url' => $o->payment_proof_url,
                'rejection_reason' => $o->rejection_reason,
                'notes' => $o->notes,
                'delivery_date' => $o->delivery_date,
                'delivery_time_slot' => $o->delivery_time_slot,
                'card_to' => $o->card_to,
                'card_from' => $o->card_from,
                'card_message' => $o->card_message,
                'delivery_fee' => (float) $o->delivery_fee,
                'items' => $o->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_name' => $item->product_name,
                        'quantity' => $item->quantity,
                        'price' => (float) $item->price,
                        'price_formatted' => 'Rp '.number_format($item->price, 0, ',', '.'),
                        'subtotal_formatted' => 'Rp '.number_format($item->price * $item->quantity, 0, ',', '.'),
                        'custom_request' => $item->custom_request,
                    ];
                }),
            ];
        });

        // Distinct bouquet types for the filter
        $existingBouquetTypes = OrderItem::select('product_name')
            ->distinct()
            ->pluck('product_name')
            ->filter()
            ->values();

        // Also get all products for the manual order modal
        $products = Product::all(['id', 'name', 'price']);

        // Orders needing payment verification
        $realVerifications = Order::whereIn('payment_status', ['pending', 'rejected'])
            ->with(['items.product', 'user'])
            ->orderBy('created_at', 'desc')
            ->take(20)
            ->get()
            ->map(function ($o) use ($monthNames) {
                $firstItem = $o->items->first();
                $productName = $firstItem ? $firstItem->product_name : 'Buket Bunga Florabelle';
                $dateMonth = $monthNames[$o->created_at->month] ?? $o->created_at->format('M');

                return [
                    'id' => 'FLR-'.str_pad($o->id, 4, '0', STR_PAD_LEFT),
                    'raw_id' => $o->id,
                    'customer_name' => $o->customer_name,
                    'customer_phone' => $o->customer_phone,
                    'customer_address' => $o->customer_address,
                    'bouquet_name' => $productName,
                    'total' => (float) $o->total,
                    'total_formatted' => 'Rp '.number_format($o->total, 0, ',', '.'),
                    'payment_status' => $o->payment_status,
                    'payment_method' => $o->payment_method ?: 'Transfer Bank',
                    'payment_proof_url' => $o->payment_proof_url ?: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&w=600&q=80',
                    'rejection_reason' => $o->rejection_reason,
                    'created_at' => $o->created_at->day.' '.$dateMonth.' '.$o->created_at->year.', '.$o->created_at->format('H:i'),
                    'status' => $o->status,
                ];
            });

        $pendingCount = Order::where('payment_status', 'pending')->count();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $ordersPaginator,
            'bouquetTypes' => $existingBouquetTypes,
            'products' => $products,
            'verifications' => $realVerifications,
            'pendingVerificationCount' => $pendingCount,
            'activeTab' => $request->query('tab', 'all'),
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? 'all',
                'bouquet_type' => $request->bouquet_type ?? 'all',
                'date' => $request->date ?? '',
            ],
        ]);
    }

    /**
     * Update the specified order status in storage.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string',
            'payment_status' => 'nullable|string',
        ]);

        $statusMap = [
            'Menunggu Pembayaran' => 'pending',
            'Diproses' => 'processing',
            'Sedang Dirangkai' => 'processing',
            'Selesai' => 'completed',
            'Selesai / Dikirim' => 'completed',
            'Dibatalkan' => 'cancelled',
            'pending' => 'pending',
            'processing' => 'processing',
            'completed' => 'completed',
            'cancelled' => 'cancelled',
        ];

        $targetStatus = $statusMap[$request->status] ?? $request->status;

        // Parse ID format FLR-1001 or integer
        $cleanId = is_numeric($id) ? (int) $id : (int) str_replace('FLR-', '', $id);
        $order = Order::findOrFail($cleanId);

        $order->status = $targetStatus;

        if ($request->filled('payment_status')) {
            $order->payment_status = $request->payment_status;
        } elseif ($targetStatus === 'completed' || $targetStatus === 'processing') {
            // Auto mark payment as paid if order is being processed/completed and still pending
            if ($order->payment_status === 'pending') {
                $order->payment_status = 'paid';
            }
        }

        $order->save();

        return back()->with('success', 'Status pesanan FLR-'.str_pad($order->id, 4, '0', STR_PAD_LEFT).' berhasil diperbarui!');
    }

    /**
     * Verifikasi Pembayaran langsung dari halaman Pesanan.
     */
    public function verifyPayment(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
            'reason' => 'nullable|string|max:255',
        ]);

        $cleanId = is_numeric($id) ? (int) $id : (int) str_replace('FLR-', '', $id);
        $order = Order::findOrFail($cleanId);

        if ($request->action === 'approve') {
            $order->payment_status = 'paid';
            $order->status = 'processing';
            $order->rejection_reason = null;
            $order->save();

            return back()->with('success', 'Pembayaran FLR-'.str_pad($order->id, 4, '0', STR_PAD_LEFT).' disetujui! Pesanan otomatis dialihkan ke status Diproses.');
        } else {
            $order->payment_status = 'rejected';
            $order->rejection_reason = $request->reason ?? 'Bukti pembayaran ditolak.';
            $order->save();

            return back()->with('success', 'Bukti pembayaran FLR-'.str_pad($order->id, 4, '0', STR_PAD_LEFT).' telah ditolak.');
        }
    }

    /**
     * Store a manual order.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:50',
            'customer_address' => 'required|string',
            'product_id' => 'nullable|integer',
            'product_name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string',
            'payment_method' => 'nullable|string',
            'status' => 'nullable|string',
        ]);

        $adminUser = auth()->user() ?? User::where('role', 'admin')->first() ?? User::first();
        $totalPrice = $validated['price'] * $validated['quantity'];

        $order = Order::create([
            'user_id' => $adminUser ? $adminUser->id : 1,
            'total' => $totalPrice,
            'payment_method' => $validated['payment_method'] ?? 'Transfer Bank',
            'customer_name' => $validated['customer_name'],
            'customer_phone' => $validated['customer_phone'],
            'customer_address' => $validated['customer_address'],
            'notes' => $validated['notes'] ?? null,
            'status' => $validated['status'] ?? 'pending',
            'payment_status' => ($validated['status'] ?? 'pending') === 'completed' ? 'paid' : 'pending',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $validated['product_id'] ?? 1,
            'product_name' => $validated['product_name'],
            'price' => $validated['price'],
            'quantity' => $validated['quantity'],
        ]);

        return back()->with('success', 'Pesanan manual FLR-'.str_pad($order->id, 4, '0', STR_PAD_LEFT).' berhasil dibuat!');
    }
}
