<?php

namespace App\Http\Controllers;

use App\Services\KMeansClusteringService;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminDataMiningController extends Controller
{
    public function __construct(private readonly KMeansClusteringService $kmeans) {}

    public function index(): Response
    {
        $dataset = $this->buildDataset();

        if (empty($dataset)) {
            return Inertia::render('Admin/DataMining/Index', [
                'result' => null,
                'clusterMembers' => [],
                'dataset' => [],
                'message' => 'Belum ada data transaksi yang cukup untuk dianalisis.',
            ]);
        }

        $result = $this->kmeans->run($dataset, k: 3, seed: 42);

        // Susun data tiap anggota cluster untuk tampilan tabel
        $clusterMembers = [];

        foreach ($result['clusters'] as $clusterId => $members) {
            $label = $result['labels'][$clusterId] ?? [
                'label' => "Cluster {$clusterId}",
                'color' => 'gray',
                'emoji' => '❓',
                'description' => '',
            ];

            $clusterMembers[] = [
                'cluster_id' => $clusterId,
                'label' => $label['label'],
                'color' => $label['color'],
                'emoji' => $label['emoji'],
                'description' => $label['description'],
                'count' => count($members),
                'stats' => $result['stats'][$clusterId] ?? [],
                'members' => array_map(fn ($m) => [
                    'user_id' => $m['user_id'],
                    'name' => $m['name'],
                    'recency' => (int) $m['recency'],
                    'frequency' => (int) $m['frequency'],
                    'monetary' => (float) $m['monetary'],
                    'avg_order_value' => round($m['avg_order_value']),
                    'avg_rating' => $m['avg_rating'] ? round($m['avg_rating'], 1) : null,
                ], $members),
            ];
        }

        // Urutkan: VIP (gold) dulu, lalu Regular (silver), lalu Occasional (bronze)
        usort($clusterMembers, function ($a, $b) {
            $order = ['gold' => 0, 'silver' => 1, 'bronze' => 2];

            return ($order[$a['color']] ?? 99) <=> ($order[$b['color']] ?? 99);
        });

        return Inertia::render('Admin/DataMining/Index', [
            'result' => [
                'iterations' => $result['iterations'],
                'total_customers' => count($dataset),
                'k' => 3,
            ],
            'clusterMembers' => $clusterMembers,
            'dataset' => $dataset,
        ]);
    }

    /**
     * Query dan susun dataset RFM dari tabel orders.
     *
     * @return array<int, array{user_id:int, name:string, recency:float, frequency:float, monetary:float, avg_order_value:float, avg_rating:float|null}>
     */
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
