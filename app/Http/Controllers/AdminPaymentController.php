<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminPaymentController extends Controller
{
    /**
     * Tampilkan halaman verifikasi pembayaran
     */
    public function index()
    {
        // Ambil data asli dari tabel orders yang statusnya pending atau rejected
        $orders = Order::whereIn('payment_status', ['pending', 'rejected'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Tambahkan data dummy ke awal array agar UI bisa divisualisasikan dengan lengkap (karena order asli mungkin belum ada bukti transfernya)
        $dummyOrders = [
            [
                'id' => 'FLR-9001',
                'customer_name' => 'Sarah Wijaya',
                'payment_method' => 'BCA Transfer',
                'total' => 350000,
                'payment_status' => 'pending',
                'payment_proof_url' => 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&w=600&q=80', // Gambar dummy struk
                'created_at' => now()->subMinutes(15)->format('d M Y, H:i'),
                'is_dummy' => true,
            ],
            [
                'id' => 'FLR-9002',
                'customer_name' => 'Deni Setiawan',
                'payment_method' => 'QRIS',
                'total' => 125000,
                'payment_status' => 'rejected',
                'rejection_reason' => 'Foto struk terlalu blur, nominal tidak terbaca.',
                'payment_proof_url' => 'https://images.unsplash.com/photo-1616077168712-fc6c788db4af?auto=format&fit=crop&w=600&q=80', // Gambar blur
                'created_at' => now()->subHours(2)->format('d M Y, H:i'),
                'is_dummy' => true,
            ]
        ];

        // Format data asli agar strukturnya sama dengan UI kita
        $realOrders = $orders->map(function ($order) {
            return [
                'id' => 'ORD-' . $order->id,
                'real_id' => $order->id, // Untuk URL update
                'customer_name' => $order->customer_name,
                'payment_method' => $order->payment_method,
                'total' => $order->total,
                'payment_status' => $order->payment_status,
                'payment_proof_url' => $order->payment_proof_url,
                'rejection_reason' => $order->rejection_reason,
                'created_at' => $order->created_at->format('d M Y, H:i'),
                'is_dummy' => false,
            ];
        })->toArray();

        // Gabungkan dummy dan data asli
        $allOrders = array_merge($dummyOrders, $realOrders);

        return Inertia::render('Admin/Payments/Index', [
            'payments' => $allOrders
        ]);
    }

    /**
     * Terima/Validasi Pembayaran
     */
    public function approve($id)
    {
        // Abaikan jika ini ID dummy
        if (str_starts_with($id, 'FLR-')) {
            return back()->with('success', 'Pembayaran untuk pesanan dummy divalidasi!');
        }

        $order = Order::findOrFail($id);
        
        $order->update([
            'payment_status' => 'paid',
            'status' => 'Sedang Dirangkai' // Ubah status pesanan
        ]);

        return back()->with('success', 'Pembayaran berhasil divalidasi.');
    }

    /**
     * Tolak Pembayaran
     */
    public function reject(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|min:5|max:255'
        ]);

        // Abaikan jika ini ID dummy
        if (str_starts_with($id, 'FLR-')) {
            return back()->with('success', 'Pembayaran untuk pesanan dummy ditolak dengan alasan: ' . $request->reason);
        }

        $order = Order::findOrFail($id);
        
        $order->update([
            'payment_status' => 'rejected',
            'rejection_reason' => $request->reason
        ]);

        return back()->with('success', 'Pembayaran ditolak. Pembeli akan diminta mengunggah ulang bukti.');
    }
}
