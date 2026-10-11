<footer class="ft">
<div class="container">
    <div class="row g-4">
        <div class="col-lg-4">
            <div class="nav-brand d-inline-flex mb-3" style="color:#fff;font-size:1.3rem"><i class="fas fa-seedling"></i> Flora<span>Belle</span></div>
            <p style="font-size:.86rem;max-width:280px">Toko bunga premium dengan koleksi terbaik untuk setiap momen spesial.</p>
        </div>
        <div class="col-lg-2 col-6"><h5>Navigasi</h5><div class="d-flex flex-column gap-2" style="font-size:.86rem"><a href="home.php">Beranda</a><a href="cart.php">Keranjang</a><a href="orders.php">Pesanan</a></div></div>
        <div class="col-lg-3 col-6"><h5>Kategori</h5><div class="d-flex flex-column gap-2" style="font-size:.86rem"><a href="home.php?category=Bunga+Potong">Bunga Potong</a><a href="home.php?category=Buket">Buket</a><a href="home.php?category=Bunga+Pot">Bunga Pot</a></div></div>
        <div class="col-lg-3"><h5>Kontak</h5><div class="d-flex flex-column gap-2" style="font-size:.86rem"><span><i class="fas fa-phone me-2"></i>0812-3456-7890</span><span><i class="fas fa-envelope me-2"></i>halo@florabelle.com</span></div></div>
    </div>
    <div class="ft-b">&copy; <?=date('Y')?> FloraBelle. Semua hak dilindungi.</div>
</div>
</footer>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script>
var fu=document.querySelectorAll('.fu');if('IntersectionObserver' in window){var ob=new IntersectionObserver(function(en){en.forEach(function(e,i){if(e.isIntersecting){setTimeout(function(){e.target.classList.add('visible')},i*80);ob.unobserve(e.target)}})},{threshold:.1});fu.forEach(function(el){ob.observe(el)})}else{fu.forEach(function(el){el.classList.add('visible')})}
function cQ(b,d){var i=b.parentElement.querySelector('input[type="number"]');var v=parseInt(i.value)+d;var m=parseInt(i.max)||999;if(v<0)v=0;if(v>m)v=m;i.value=v}
function tD(id){var r=document.getElementById('d-'+id);r.style.display=r.style.display==='none'?'':'none'}
document.querySelectorAll('.emoji-opt').forEach(function(l){var r=l.querySelector('input');function u(){l.style.background=r.checked?'rgba(45,90,61,.12)':'transparent';l.style.transform=r.checked?'scale(1.15)':'scale(1)'}r.addEventListener('change',u);u()});
document.querySelectorAll('.po').forEach(function(o){var r=o.querySelector('input[type="radio"]');r.addEventListener('change',function(){document.querySelectorAll('.po').forEach(function(x){x.classList.remove('selected')});o.classList.add('selected')});if(r.checked)o.classList.add('selected')});
setTimeout(function(){document.querySelectorAll('.toast-m').forEach(function(t){t.style.opacity='0';t.style.transform='translateX(100%)';t.style.transition='all .4s';setTimeout(function(){t.remove()},400)})},3500);
</script>
</body>
</html>