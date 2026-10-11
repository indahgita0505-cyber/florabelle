// ========== KELAS UNTUK MENANGANI FITUR TOKO ==========
class FloraBelle {
    constructor() {
        this.cartCount = 0;
        this.toastDuration = 3500;
        this.init();
    }

    // Inisialisasi semua event listener dan fitur
    init() {
        this.initFadeUp();
        this.initMobileMenu();
        this.initToastAutoClose();
        this.initPaymentMethodToggle();
        this.initCartSelection();
        this.initQuantityUpdate();
        this.initDeleteConfirm();
    }

    // Animasi fade-up saat scroll
    initFadeUp() {
        const faders = document.querySelectorAll('.fu');
        if ('IntersectionObserver' in window && faders.length) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            faders.forEach(el => observer.observe(el));
        } else {
            faders.forEach(el => el.classList.add('visible'));
        }
    }

    // Mobile menu toggle (hamburger)
    initMobileMenu() {
        const btn = document.querySelector('.d-md-none');
        if (btn) {
            btn.addEventListener('click', () => {
                const menu = document.getElementById('mm');
                if (menu) menu.classList.toggle('d-none');
            });
        }
    }

    // Toast notifikasi otomatis hilang
    initToastAutoClose() {
        const toasts = document.querySelectorAll('.toast-m');
        if (!toasts.length) return;
        setTimeout(() => {
            toasts.forEach(t => {
                t.style.opacity = '0';
                t.style.transform = 'translateX(100%)';
                t.style.transition = 'all 0.4s';
                setTimeout(() => t.remove(), 400);
            });
        }, this.toastDuration);
    }

    // Toggle field e-wallet di halaman checkout
    initPaymentMethodToggle() {
        const paymentSelect = document.getElementById('paymentMethod');
        const ewalletDiv = document.getElementById('ewalletDetails');
        if (paymentSelect && ewalletDiv) {
            const toggle = () => {
                ewalletDiv.style.display = paymentSelect.value === 'ewallet' ? 'block' : 'none';
            };
            paymentSelect.addEventListener('change', toggle);
            toggle(); // set awal
        }
    }

    // Fitur "Pilih Semua" dan update total di keranjang
    initCartSelection() {
        const selectAll = document.getElementById('selectAll');
        const checkboxes = document.querySelectorAll('.item-checkbox');
        const totalSpan = document.getElementById('totalSelected');
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (!selectAll || !checkboxes.length) return;

        const updateTotal = () => {
            let total = 0;
            let anyChecked = false;
            const rows = document.querySelectorAll('tbody tr');
            rows.forEach((row, idx) => {
                const cb = checkboxes[idx];
                if (cb && cb.checked) {
                    anyChecked = true;
                    const subtotalText = row.querySelector('.subtotal')?.innerText || '0';
                    const subtotal = parseInt(subtotalText.replace(/[^0-9]/g, ''));
                    total += subtotal;
                }
            });
            if (totalSpan) totalSpan.innerText = 'Rp ' + total.toLocaleString('id-ID');
            if (checkoutBtn) checkoutBtn.disabled = !anyChecked;
        };

        selectAll.addEventListener('change', () => {
            checkboxes.forEach(cb => cb.checked = selectAll.checked);
            updateTotal();
        });
        checkboxes.forEach(cb => cb.addEventListener('change', updateTotal));
        updateTotal();
    }

    // Update quantity via AJAX (tanpa reload)
    initQuantityUpdate() {
        const qtyInputs = document.querySelectorAll('input[name^="qty"]');
        qtyInputs.forEach(inp => {
            inp.addEventListener('change', () => {
                const cartId = inp.dataset.cartid;
                const newQty = inp.value;
                fetch('process.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `action=update_cart&cart_id=${cartId}&quantity=${newQty}`
                }).then(() => location.reload());
            });
        });
    }

    // Konfirmasi hapus (tombol dengan class .btn-d atau .confirm-hapus)
    initDeleteConfirm() {
        const deleteBtns = document.querySelectorAll('.btn-d, .confirm-hapus');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!confirm('Apakah Anda yakin? Tindakan ini tidak dapat dibatalkan.')) {
                    e.preventDefault();
                }
            });
        });
    }
}

// ========== BUAT OBJEK DARI KELAS ==========
const floraApp = new FloraBelle();

// ========== FUNGSI GLOBAL (untuk onclick di HTML) ==========
function tD(id) {
    const row = document.getElementById('d-' + id);
    if (row) row.style.display = row.style.display === 'none' ? '' : 'none';
}

function cQ(btn, delta) {
    const input = btn.parentElement.querySelector('input[type="number"]');
    if (!input) return;
    let val = parseInt(input.value) || 0;
    val += delta;
    const max = parseInt(input.max) || 999;
    if (val < 0) val = 0;
    if (val > max) val = max;
    input.value = val;
}

function confirmCancel(orderId) {
    const msg = "⚠️ PERHATIAN!\n\nPesanan akan dibatalkan dan stok produk akan dikembalikan.\n\nJika Anda sudah melakukan transfer, dana akan dikembalikan sesuai kebijakan toko (proses 1x24 jam).\n\nYakin ingin membatalkan pesanan ini?";
    if (confirm(msg)) {
        window.location.href = "process.php?action=cancel_order&id=" + orderId;
    }
}