        <!-- Tutup area konten -->
    </main>
</div><!-- Tutup admin-wrapper -->


<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="../script.js"></script>
<script>
document.querySelectorAll('.emoji-opt').forEach(function(l){var r=l.querySelector('input');function u(){l.style.background=r.checked?'rgba(45,90,61,.12)':'transparent';l.style.transform=r.checked?'scale(1.15)':'scale(1)'}r.addEventListener('change',u);u()});
function tD(id){var r=document.getElementById('d-'+id);r.style.display=r.style.display==='none'?'':'none'}
setTimeout(function(){document.querySelectorAll('.toast-m').forEach(function(t){t.style.opacity='0';t.style.transform='translateX(100%)';t.style.transition='all .4s';setTimeout(function(){t.remove()},400)})},3500);
</script>
</body>
</html>