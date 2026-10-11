<?php
class OrderManager 
{
    private $db;
    private $status_opts = ['pending','confirmed','shipped','delivered','cancelled'];
    private $status_map = [
        'pending'   => 'Menunggu',
        'confirmed' => 'Dikonfirmasi', 
        'shipped'   => 'Dikirim',
        'delivered' => 'Selesai',
        'cancelled' => 'Dibatalkan'
    ];

    public function __construct($db) 
    {
        $this->db = $db;
    }

    public function getAllOrders() 
    {
        $stmt = $this->db->query("
            SELECT o.*, u.username 
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            ORDER BY o.id DESC
        ");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getOrderItems($order_id) 
    {
        $stmt = $this->db->prepare("SELECT * FROM order_items WHERE order_id = ?");
        $stmt->execute([$order_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getStatusOptions() 
    {
        return $this->status_opts;
    }

    public function getStatusLabel($status) 
    {
        return $this->status_map[$status] ?? $status;
    }

    public function formatOrderNumber($id) 
    {
        return '#FLB-' . str_pad($id, 5, '0', STR_PAD_LEFT);
    }

    public function updateStatus($order_id, $status) 
    {
        if (!in_array($status, $this->status_opts)) {
            return false;
        }
        $stmt = $this->db->prepare("UPDATE orders SET status = ? WHERE id = ?");
        return $stmt->execute([$status, $order_id]);
    }
}