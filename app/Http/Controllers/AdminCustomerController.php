<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\KMeansClusteringService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminCustomerController extends Controller
{
    public function __construct(private readonly KMeansClusteringService $kmeans) {}

    public function index(Request $request)
    {
        $query = User::where('role', 'user')
            ->with(['orders' => function ($q) {
                // Eager load order items to show what they bought
                $q->with('items.product')->orderBy('created_at', 'desc');
            }]);

        // Pencarian sederhana berdasarkan nama atau email
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Jalankan K-Means Clustering
        $dataset = $this->buildDataset();
        $clusterLabels = [];
        if (! empty($dataset)) {
            $result = $this->kmeans->run($dataset, k: 3, seed: 42);
            foreach ($result['clusters'] as $clusterId => $members) {
                $label = $result['labels'][$clusterId] ?? ['label' => 'Unknown', 'color' => 'gray', 'emoji' => '❓'];
                foreach ($members as $member) {
                    $clusterLabels[$member['user_id']] = $label;
                }
            }
        }

        $customers = $query->orderBy('created_at', 'desc')->get()->map(function ($user) use ($clusterLabels) {
            // Hitung total pesanan selesai (asumsi status 'Selesai / Dikirim' atau 'completed')
            $completedOrders = $user->orders->filter(function ($order) {
                return in_array(strtolower($order->status), ['selesai', 'selesai / dikirim', 'completed']);
            })->count();

            // Transform data orders agar lebih mudah dibaca di frontend
            $history = $user->orders->map(function ($order) {
                return [
                    'id' => 'ORD-'.$order->id,
                    'date' => $order->created_at->format('d M Y'),
                    'total' => $order->total,
                    'status' => $order->status,
                    'items' => $order->items->map(function ($item) {
                        return $item->product ? $item->product->name.' (x'.$item->quantity.')' : 'Produk Dihapus';
                    })->implode(', ') ?: 'Custom Buket',
                ];
            });

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->whatsapp_number ?? '-',
                'completed_orders_count' => $completedOrders,
                'history' => $history,
                'joined_at' => $user->created_at->format('d M Y'),
                'cluster' => $clusterLabels[$user->id] ?? null,
            ];
        });

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
            'filters' => $request->only('search'),
        ]);
    }

    private function buildDataset(): array
    {
        $rows = DB::table('orders')
            ->join('users', 'users.id', '=', 'orders.user_id')
            ->leftJoin('reviews', 'reviews.user_id', '=', 'users.id')
            ->where('orders.status', 'completed')
            ->select([
                'users.id as user_id',
                'users.name',
                DB::raw('DATEDIFF(NOW(), MAX(orders.created_at)) as recency'),
                DB::raw('COUNT(DISTINCT orders.id) as frequency'),
                DB::raw('SUM(orders.total) as monetary'),
                DB::raw('AVG(orders.total) as avg_order_value'),
                DB::raw('AVG(reviews.rating) as avg_rating'),
            ])
            ->groupBy('users.id', 'users.name')
            ->having('frequency', '>=', 1)
            ->get();

        return $rows->map(fn ($row) => [
            'user_id' => $row->user_id,
            'name' => $row->name,
            'recency' => (float) $row->recency,
            'frequency' => (float) $row->frequency,
            'monetary' => (float) $row->monetary,
            'avg_order_value' => (float) $row->avg_order_value,
            'avg_rating' => $row->avg_rating ? (float) $row->avg_rating : null,
        ])->values()->all();
    }
}
