<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Models\CustomOrder;

class AdminOrderController extends Controller
{
    /**
     * Display a listing of the orders.
     */
    public function index()
    {
        $ordersData = Order::with(['user', 'items.product'])->orderBy('created_at', 'desc')->get()->map(function($o) {
            $statusText = $o->status;
            if ($o->status == 'pending') $statusText = 'Menunggu Pembayaran';
            else if ($o->status == 'processing') $statusText = 'Diproses';
            else if ($o->status == 'completed') $statusText = 'Selesai';
            else if ($o->status == 'cancelled') $statusText = 'Dibatalkan';

            // Format items
            $itemsText = $o->items->map(function($i) {
                return $i->product->name . ' (' . $i->quantity . 'x)';
            })->implode(', ');

            return [
                'id' => 'FLR-' . str_pad($o->id, 4, '0', STR_PAD_LEFT),
                'customer_name' => $o->customer_name,
                'date' => $o->created_at->format('Y-m-d H:i:s'),
                'created_at' => $o->created_at,
                'total_price' => $o->total,
                'status' => $statusText,
                'details' => [
                    'bouquet_type' => 'Katalog Regular',
                    'contents' => $itemsText,
                    'color' => '-',
                    'wrapping' => '-',
                    'message' => $o->notes ?? '-',
                    'address' => $o->customer_address,
                ]
            ];
        });

        $customOrdersData = CustomOrder::orderBy('created_at', 'desc')->get()->map(function($o) {
            $statusText = $o->status;
            if ($o->status == 'pending') $statusText = 'Menunggu Pembayaran';
            else if ($o->status == 'processing') $statusText = 'Diproses';
            else if ($o->status == 'completed') $statusText = 'Selesai';
            else if ($o->status == 'cancelled') $statusText = 'Dibatalkan';

            $isiText = is_array($o->isi_buket) ? implode(', ', $o->isi_buket) : $o->isi_buket;

            return [
                'id' => 'CUST-' . str_pad($o->id, 4, '0', STR_PAD_LEFT),
                'customer_name' => $o->customer_name,
                'date' => $o->created_at->format('Y-m-d H:i:s'),
                'created_at' => $o->created_at,
                'total_price' => $o->budget,
                'status' => $statusText,
                'details' => [
                    'bouquet_type' => 'Custom Buket',
                    'contents' => $isiText,
                    'color' => $o->tema_warna,
                    'wrapping' => $o->wrapping,
                    'message' => $o->ucapan ?? '-',
                    'address' => $o->customer_address,
                ]
            ];
        });

        $orders = $ordersData->concat($customOrdersData)
            ->sortByDesc('created_at')
            ->values()
            ->toArray();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders
        ]);
    }

    /**
     * Update the specified order status in storage.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:Menunggu Pembayaran,Sedang Dirangkai,Selesai / Dikirim',
        ]);

        $statusMap = [
            'Menunggu Pembayaran' => 'pending',
            'Sedang Dirangkai' => 'processing',
            'Selesai / Dikirim' => 'completed',
        ];

        $dbStatus = $statusMap[$request->status];

        // Parse ID format FLR-1001 or CUST-1001
        if (str_starts_with($id, 'FLR-')) {
            $realId = (int) str_replace('FLR-', '', $id);
            Order::where('id', $realId)->update(['status' => $dbStatus]);
        } else if (str_starts_with($id, 'CUST-')) {
            $realId = (int) str_replace('CUST-', '', $id);
            CustomOrder::where('id', $realId)->update(['status' => $dbStatus]);
        }

        return back()->with('success', 'Status pesanan berhasil diperbarui!');
    }
}
