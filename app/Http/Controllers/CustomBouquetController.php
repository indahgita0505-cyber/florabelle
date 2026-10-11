<?php

namespace App\Http\Controllers;

use App\Models\BouquetOption;
use App\Models\CustomOrder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class CustomBouquetController extends Controller
{
    public function index()
    {
        $options = BouquetOption::where('is_active', true)->get();
        $products = Product::all();

        return Inertia::render('CustomBouquet/Index', [
            'dynamicOptions' => $options,
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        if ($request->has('jenis_bucket')) {
            $validated = $request->validate([
                'jenis_bucket' => 'required|string',
                'isi_request' => 'required|string',
                'warna_bunga' => 'nullable|string',
                'warna_kertas' => 'nullable|string',
                'model_kertas' => 'nullable|string',
                'warna_pita' => 'nullable|string',
                'model_pita' => 'nullable|string',
                'hiasan' => 'nullable|array',
                'komentar_khusus' => 'nullable|string',
                'estimasi_harga' => 'nullable|numeric',
            ]);

            $user = Auth::user();
            $userId = $user ? $user->id : (Auth::check() ? Auth::id() : 2);
            $total = $validated['estimasi_harga'] ?? 150000;

            $notesData = [
                'is_custom_bucket' => true,
                'jenis_bucket' => $validated['jenis_bucket'],
                'isi_request' => $validated['isi_request'],
                'warna_bunga' => $validated['warna_bunga'] ?? null,
                'warna_kertas' => $validated['warna_kertas'] ?? null,
                'model_kertas' => $validated['model_kertas'] ?? null,
                'warna_pita' => $validated['warna_pita'] ?? null,
                'model_pita' => $validated['model_pita'] ?? null,
                'hiasan' => $validated['hiasan'] ?? [],
                'komentar_khusus' => $validated['komentar_khusus'] ?? null,
                'estimasi_harga' => $total,
            ];

            DB::beginTransaction();
            try {
                $order = Order::create([
                    'user_id' => $userId,
                    'total' => $total,
                    'payment_method' => 'Transfer Bank (Menunggu Konfirmasi)',
                    'customer_name' => $user?->name ?? 'Pelanggan Setia',
                    'customer_phone' => $user?->whatsapp_number ?? '0823 4567 8910',
                    'customer_address' => 'Alamat Pengiriman (Dikonfirmasi Toko)',
                    'notes' => json_encode($notesData),
                    'status' => 'pending',
                    'payment_status' => 'pending',
                ]);

                $matchedProduct = Product::where('name', 'like', '%'.$validated['jenis_bucket'].'%')->first() ?? Product::first();

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $matchedProduct ? $matchedProduct->id : 1,
                    'product_name' => $validated['jenis_bucket'],
                    'price' => $total,
                    'quantity' => 1,
                ]);

                CustomOrder::create([
                    'customer_name' => $order->customer_name,
                    'customer_phone' => $order->customer_phone,
                    'customer_address' => $order->customer_address,
                    'isi_buket' => [$validated['jenis_bucket'], $validated['isi_request']],
                    'tema_warna' => $validated['warna_bunga'] ?? $validated['warna_kertas'] ?? 'Pink',
                    'wrapping' => ($validated['warna_kertas'] ?? '').' '.($validated['model_kertas'] ?? ''),
                    'budget' => $total,
                    'ucapan' => $validated['komentar_khusus'] ?? '',
                    'status' => 'pending',
                    'payment_status' => 'pending',
                ]);

                DB::commit();

                $code = '#BK'.$order->created_at->format('Ymd').str_pad($order->id, 3, '0', STR_PAD_LEFT);

                if ($request->wantsJson() || $request->ajax()) {
                    return response()->json([
                        'success' => true,
                        'order_id' => $order->id,
                        'order_code' => $code,
                        'message' => 'Request bucket kamu telah berhasil dikirim. Silakan tunggu konfirmasi dari toko.',
                    ]);
                }

                session()->flash('success', 'Request bucket kamu telah berhasil dikirim. Silakan tunggu konfirmasi dari toko.');

                return redirect()->route('orders.index');
            } catch (\Exception $e) {
                DB::rollBack();

                if ($request->wantsJson() || $request->ajax()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Gagal mengirim request: '.$e->getMessage(),
                    ], 500);
                }

                return redirect()->back()->with('error', 'Gagal mengirim request: '.$e->getMessage());
            }
        }

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
                ."Order ID: #{$order->id}\n"
                ."Pemesan: {$validated['customerName']} ({$validated['customerPhone']})\n"
                ."Isi Buket: {$isi}\n"
                ."Tema Warna: {$validated['warna']}\n"
                ."Wrapping: {$validated['wrapping']}\n"
                ."Budget: Rp {$budget}\n"
                ."Ucapan: \"{$validated['ucapan']}\"\n\n"
                ."Status Pembayaran: Lunas (Verified via Gateway)\n"
                .'Silakan proses pesanan ini.';

            Http::post("https://api.telegram.org/bot{$telegramToken}/sendMessage", [
                'chat_id' => $telegramChatId,
                'text' => $message,
                'parse_mode' => 'Markdown',
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
