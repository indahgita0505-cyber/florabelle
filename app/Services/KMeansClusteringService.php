<?php

namespace App\Services;

/**
 * K-Means Clustering Service
 *
 * Mengimplementasikan algoritma K-Means dari awal (pure PHP)
 * untuk segmentasi pelanggan berdasarkan fitur RFM:
 *   - R (Recency)   : Hari sejak transaksi terakhir (lebih kecil = lebih baik)
 *   - F (Frequency) : Total jumlah transaksi
 *   - M (Monetary)  : Total nilai belanja (rupiah)
 *
 * Proses:
 * 1. Normalisasi Min-Max semua fitur ke rentang [0, 1]
 * 2. Inisialisasi centroid secara acak
 * 3. Iterasi: assign data ke centroid terdekat, lalu update centroid
 * 4. Ulangi hingga konvergen (tidak ada perubahan assignment)
 */
class KMeansClusteringService
{
    private const MAX_ITERATIONS = 100;

    /**
     * Jalankan K-Means clustering.
     *
     * @param  array<int, array{user_id:int, name:string, recency:float, frequency:float, monetary:float, avg_order_value:float, avg_rating:float|null}>  $dataset
     * @param  int  $k  Jumlah cluster
     * @param  int  $seed  Random seed untuk reproducibility
     * @return array{clusters: array<int, array<int, mixed>>, centroids: array<int, array<string, float>>, iterations: int, stats: array<string, mixed>}
     */
    public function run(array $dataset, int $k = 3, int $seed = 42): array
    {
        if (count($dataset) < $k) {
            throw new \InvalidArgumentException("Dataset harus memiliki setidaknya {$k} data points.");
        }

        // Fitur yang digunakan untuk clustering
        $features = ['recency', 'frequency', 'monetary'];

        // 1. Normalisasi min-max
        $normalized = $this->normalize($dataset, $features);

        // 2. Inisialisasi centroid (random dengan seed)
        mt_srand($seed);
        $centroids = $this->initCentroids($normalized, $k, $features);

        // 3. Iterasi K-Means
        $assignments = [];
        $prevAssigns = null;
        $iterations = 0;

        for ($iter = 0; $iter < self::MAX_ITERATIONS; $iter++) {
            $iterations++;
            $assignments = $this->assignClusters($normalized, $centroids, $features);

            if ($assignments === $prevAssigns) {
                break; // Konvergen
            }

            $prevAssigns = $assignments;
            $centroids = $this->updateCentroids($normalized, $assignments, $k, $features);
        }

        // 4. Susun hasil
        $clusters = $this->buildClusters($dataset, $assignments, $k);

        // 5. Beri label otomatis berdasarkan nilai monetary rata-rata centroid
        $clusterLabels = $this->labelClusters($clusters, $dataset);

        return [
            'clusters' => $clusters,
            'centroids' => $centroids,
            'iterations' => $iterations,
            'labels' => $clusterLabels,
            'stats' => $this->buildStats($clusters, $dataset, $k),
        ];
    }

    // =========================================================================
    // NORMALISASI
    // =========================================================================

    /**
     * @param  array<int, array<string, mixed>>  $dataset
     * @param  string[]  $features
     * @return array<int, array<string, float>>
     */
    private function normalize(array $dataset, array $features): array
    {
        $mins = [];
        $maxs = [];

        foreach ($features as $feature) {
            $values = array_column($dataset, $feature);
            $mins[$feature] = (float) min($values);
            $maxs[$feature] = (float) max($values);
        }

        $normalized = [];

        foreach ($dataset as $i => $point) {
            $norm = ['_index' => $i];

            foreach ($features as $feature) {
                $range = $maxs[$feature] - $mins[$feature];
                $norm[$feature] = $range > 0
                    ? ($point[$feature] - $mins[$feature]) / $range
                    : 0.0;
            }

            $normalized[$i] = $norm;
        }

        return $normalized;
    }

    // =========================================================================
    // INISIALISASI CENTROID
    // =========================================================================

    /**
     * @param  array<int, array<string, float>>  $normalized
     * @param  string[]  $features
     * @return array<int, array<string, float>>
     */
    private function initCentroids(array $normalized, int $k, array $features): array
    {
        $indices = array_keys($normalized);
        $shuffled = $indices;
        shuffle($shuffled);

        $centroids = [];

        for ($i = 0; $i < $k; $i++) {
            $idx = $shuffled[$i];

            foreach ($features as $feature) {
                $centroids[$i][$feature] = $normalized[$idx][$feature];
            }
        }

        return $centroids;
    }

    // =========================================================================
    // ASSIGNMENT
    // =========================================================================

    /**
     * Assign setiap data point ke centroid terdekat (Euclidean distance).
     *
     * @param  array<int, array<string, float>>  $normalized
     * @param  array<int, array<string, float>>  $centroids
     * @param  string[]  $features
     * @return array<int, int> map dari index data => index cluster
     */
    private function assignClusters(array $normalized, array $centroids, array $features): array
    {
        $assignments = [];

        foreach ($normalized as $i => $point) {
            $minDist = PHP_FLOAT_MAX;
            $bestCluster = 0;

            foreach ($centroids as $clusterId => $centroid) {
                $dist = $this->euclideanDistance($point, $centroid, $features);

                if ($dist < $minDist) {
                    $minDist = $dist;
                    $bestCluster = $clusterId;
                }
            }

            $assignments[$i] = $bestCluster;
        }

        return $assignments;
    }

    private function euclideanDistance(array $a, array $b, array $features): float
    {
        $sum = 0.0;

        foreach ($features as $feature) {
            $sum += ($a[$feature] - $b[$feature]) ** 2;
        }

        return sqrt($sum);
    }

    // =========================================================================
    // UPDATE CENTROID
    // =========================================================================

    /**
     * @param  array<int, array<string, float>>  $normalized
     * @param  array<int, int>  $assignments
     * @param  string[]  $features
     * @return array<int, array<string, float>>
     */
    private function updateCentroids(array $normalized, array $assignments, int $k, array $features): array
    {
        $sums = array_fill(0, $k, array_fill_keys($features, 0.0));
        $counts = array_fill(0, $k, 0);

        foreach ($assignments as $i => $clusterId) {
            $counts[$clusterId]++;

            foreach ($features as $feature) {
                $sums[$clusterId][$feature] += $normalized[$i][$feature];
            }
        }

        $centroids = [];

        for ($c = 0; $c < $k; $c++) {
            foreach ($features as $feature) {
                $centroids[$c][$feature] = $counts[$c] > 0
                    ? $sums[$c][$feature] / $counts[$c]
                    : 0.0;
            }
        }

        return $centroids;
    }

    // =========================================================================
    // BUILD RESULTS
    // =========================================================================

    /**
     * @param  array<int, array<string, mixed>>  $dataset
     * @param  array<int, int>  $assignments
     * @return array<int, array<int, array<string, mixed>>>
     */
    private function buildClusters(array $dataset, array $assignments, int $k): array
    {
        $clusters = array_fill(0, $k, []);

        foreach ($assignments as $dataIndex => $clusterId) {
            $clusters[$clusterId][] = $dataset[$dataIndex];
        }

        return $clusters;
    }

    /**
     * Beri label tiap cluster berdasarkan rata-rata RFM.
     * Cluster dengan monetary tertinggi = VIP, terendah = Occasional.
     *
     * @param  array<int, array<int, array<string, mixed>>>  $clusters
     * @param  array<int, array<string, mixed>>  $dataset
     * @return array<int, array{label: string, color: string, emoji: string, description: string}>
     */
    private function labelClusters(array $clusters, array $dataset): array
    {
        $clusterStats = [];

        foreach ($clusters as $clusterId => $members) {
            if (empty($members)) {
                $clusterStats[$clusterId] = ['monetary' => 0, 'frequency' => 0, 'recency' => 0];

                continue;
            }

            $clusterStats[$clusterId] = [
                'monetary' => array_sum(array_column($members, 'monetary')) / count($members),
                'frequency' => array_sum(array_column($members, 'frequency')) / count($members),
                'recency' => array_sum(array_column($members, 'recency')) / count($members),
            ];
        }

        // Urutkan cluster berdasarkan monetary (DESC)
        arsort($clusterStats); // biar monetary tertinggi di index pertama

        $labelMap = [];
        $rank = 0;

        $labelDefs = [
            ['label' => 'VIP / High Value',       'color' => 'gold',    'emoji' => '👑', 'description' => 'Pelanggan setia dengan nilai belanja dan frekuensi tertinggi.'],
            ['label' => 'Regular / Mid Value',     'color' => 'silver',  'emoji' => '⭐', 'description' => 'Pelanggan aktif dengan pembelian yang cukup konsisten.'],
            ['label' => 'Occasional / Low Value',  'color' => 'bronze',  'emoji' => '🌱', 'description' => 'Pelanggan yang jarang berbelanja dan perlu diaktifkan kembali.'],
        ];

        foreach (array_keys($clusterStats) as $clusterId) {
            $labelMap[$clusterId] = $labelDefs[$rank] ?? $labelDefs[2];
            $rank++;
        }

        return $labelMap;
    }

    /**
     * @param  array<int, array<int, array<string, mixed>>>  $clusters
     * @param  array<int, array<string, mixed>>  $dataset
     * @return array<string, mixed>
     */
    private function buildStats(array $clusters, array $dataset, int $k): array
    {
        $stats = [];

        foreach ($clusters as $clusterId => $members) {
            if (empty($members)) {
                continue;
            }

            $stats[$clusterId] = [
                'count' => count($members),
                'avg_recency' => round(array_sum(array_column($members, 'recency')) / count($members), 1),
                'avg_frequency' => round(array_sum(array_column($members, 'frequency')) / count($members), 1),
                'avg_monetary' => round(array_sum(array_column($members, 'monetary')) / count($members)),
                'total_monetary' => array_sum(array_column($members, 'monetary')),
            ];
        }

        return $stats;
    }
}
