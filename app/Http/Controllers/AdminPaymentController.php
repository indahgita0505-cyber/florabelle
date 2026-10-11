<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class AdminPaymentController extends Controller
{
    /**
     * Tampilkan halaman verifikasi pembayaran
     */
    public function index()
    {
        return redirect()->route('admin.orders.index', ['tab' => 'verification']);
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
            'status' => 'processing',
        ]);

        return back()->with('success', 'Pembayaran berhasil divalidasi dan pesanan kini sedang diproses.');
    }

    /**
     * Tolak Pembayaran
     */
    public function reject(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|min:5|max:255',
        ]);

        // Abaikan jika ini ID dummy
        if (str_starts_with($id, 'FLR-')) {
            return back()->with('success', 'Pembayaran untuk pesanan dummy ditolak dengan alasan: '.$request->reason);
        }

        $order = Order::findOrFail($id);

        $order->update([
            'payment_status' => 'rejected',
            'rejection_reason' => $request->reason,
        ]);

        return back()->with('success', 'Pembayaran ditolak. Pembeli akan diminta mengunggah ulang bukti.');
    }
}
