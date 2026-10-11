<?php

namespace App\Http\Middleware;

use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $cartCount = $user ? Cart::where('user_id', $user->id)->sum('quantity') : 0;

        $adminNotifications = null;
        if ($user && $user->role === 'admin') {
            $recentOrders = Order::latest()->take(5)->get()->map(function ($order) {
                $isWaitingProof = $order->payment_status === 'pending' && ! empty($order->payment_proof_url);

                return [
                    'id' => $order->id,
                    'customer_name' => $order->customer_name,
                    'total' => (int) $order->total,
                    'status' => $order->status,
                    'is_waiting_verification' => $isWaitingProof,
                    'created_at_human' => $order->created_at ? $order->created_at->diffForHumans() : 'Baru saja',
                ];
            });

            $pendingCount = Order::whereIn('status', ['pending', 'processing'])
                ->orWhere(function ($q) {
                    $q->where('payment_status', 'pending')
                        ->whereNotNull('payment_proof_url')
                        ->where('payment_proof_url', '!=', '');
                })
                ->count();

            $adminNotifications = [
                'unreadCount' => $pendingCount,
                'recentOrders' => $recentOrders,
            ];
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'cartCount' => $cartCount,
            'adminNotifications' => $adminNotifications,
        ];
    }
}
