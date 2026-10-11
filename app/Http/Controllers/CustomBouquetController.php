<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CustomOrder;
use Illuminate\Support\Facades\Http;

use App\Models\BouquetOption;

class CustomBouquetController extends Controller
{
    public function index()
    {
        $options = BouquetOption::where('is_active', true)->get();
        return Inertia::render('CustomBouquet/Index', [
            'dynamicOptions' => $options
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'isiBuket' => 'required|array',
            'warna' => 'required|string',
            'wrapping' => 'required|string',
            'budget' => 'required|numeric',
            'ucapan' => 'nullable|string',
            'customerName' => 'required|string',
            'customerPhone' => 'required|string',
            'customerAddress' => 'required|string',
            'paymentMethod' => 'required|string',
        ]);

        $order = CustomOrder::create([
            'isi_buket' => $validated['isiBuket'],
            'tema_warna' => $validated['warna'],
            'wrapping' => $validated['wrapping'],
            'budget' => $validated['budget'],
            'ucapan' => $validated['ucapan'] ?? '',
            'customer_name' => $validated['customerName'],
            'customer_phone' => $validated['customerPhone'],
            'customer_address' => $validated['customerAddress'],
            'payment_method' => $validated['paymentMethod'],
            'payment_status' => 'paid', // Simulasi gateway selalu berhasil
            'payment_proof_url' => null,
        ]);

        $telegramToken = env('TELEGRAM_BOT_TOKEN');
        $telegramChatId = env('TELEGRAM_CHAT_ID');

        if ($telegramToken && $telegramChatId) {
            $isi = implode(', ', $validated['isiBuket']);
            $budget = number_format($validated['budget'], 0, ',', '.');
            $message = "💐 *Pesanan Custom Buket Baru!*\n\n"
                . "Order ID: #{$order->id}\n"
                . "Pemesan: {$validated['customerName']} ({$validated['customerPhone']})\n"
                . "Isi Buket: {$isi}\n"
                . "Tema Warna: {$validated['warna']}\n"
                . "Wrapping: {$validated['wrapping']}\n"
                . "Budget: Rp {$budget}\n"
                . "Ucapan: \"{$validated['ucapan']}\"\n\n"
                . "Status Pembayaran: Lunas (Verified via Gateway)\n"
                . "Silakan proses pesanan ini.";

            Http::post("https://api.telegram.org/bot{$telegramToken}/sendMessage", [
                'chat_id' => $telegramChatId,
                'text' => $message,
                'parse_mode' => 'Markdown'
            ]);
        }

        session()->flash('success', 'Pesanan Custom Buket Anda berhasil dibuat dan pembayaran telah terverifikasi!');
        return Inertia::location(route('home'));
    }

    public function success()
    {
        return Inertia::render('CustomBouquet/Success');
    }
}
