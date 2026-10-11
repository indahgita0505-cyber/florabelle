<?php require_once 'config.php'; if(!isLoggedIn()) redirect('login.php');
 $stmt = $db->prepare("SELECT * FROM orders WHERE user_id=? ORDER BY id DESC"); $stmt->execute([$_SESSION['user_id']]); $orders = $stmt->fetchAll();
 $sm = ['pending'=>'Menunggu','confirmed'=>'Dikonfirmasi','shipped'=>'Dikirim','delivered'=>'Selesai','cancelled'=>'Dibatalkan'];
?>
<?php require_once 'header.php'; ?>
<section class="sec-p"><div class="container" style="max-width:900px">
    <div class="sec-l"></div><h2 class="sec-t">Riwayat Pesanan</h2><p class="sec-s"><?=count($orders)?> pesanan</p>
    <?php if(empty($orders)): ?><div class="es"><i class="fas fa-receipt"></i><h4>Belum ada pesanan</h4><a href="home.php" class="btn-a mt-3"><i class="fas fa-store"></i> Belanja</a></div>
    <?php else: ?>
    <div class="rounded overflow-hidden" style="background:var(--card);border:1px solid var(--border);overflow-x:auto">
        <table class="tc"><thead><tr><th>No. Pesanan</th><th>Tanggal</th><th>Total</th><th>Bayar</th><th>Status</th><th></th></tr></thead><tbody>
        <?php foreach($orders as $o):
            $s2 = $db->prepare("SELECT * FROM order_items WHERE order_id=?"); $s2->execute([$o['id']]); $ois = $s2->fetchAll();
        ?>
        <tr><td><strong>#FLB-<?=str_pad($o['id'],5,'0','0')?></strong></td><td><?=date('d M Y',strtotime($o['created_at']))?></td><td><strong><?=rupiah($o['total'])?></strong></td><td class="text-capitalize" style="font-size:.8rem"><?=$o['payment_method']?></td><td><span class="stb st-<?=$o['status']?>"><?=$sm[$o['status']]??$o['status']?></span></td><td><button class="btn btn-sm btn-o" style="padding:.2rem .6rem" onclick="tD(<?=$o['id']?>)"><i class="fas fa-eye"></i></button></td></tr>
        <tr id="d-<?=$o['id']?>" style="display:none"><td colspan="6" style="background:var(--bg)"><div class="p-3"><?php foreach($ois as $oi): ?><div class="d-flex justify-content-between mb-1" style="font-size:.83rem"><span><?=e($oi['product_name'])?> x<?=$oi['quantity']?></span><span><?=rupiah($oi['price']*$oi['quantity'])?></span></div><?php endforeach; ?><?php if($o['customer_address']): ?><div style="font-size:.8rem;color:var(--muted);margin-top:.4rem"><i class="fas fa-map-marker-alt me-1"></i><?=e($o['customer_address'])?></div><?php endif; ?></div></td></tr>
        <?php endforeach; ?>
        </tbody></table>
    </div>
    <?php endif; ?>
</div></section>
<?php require_once 'footer.php'; ?>