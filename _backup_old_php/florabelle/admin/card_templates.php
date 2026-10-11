<?php require_once '../config.php'; ?>
<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $action = $_POST['action'] ?? '';
    if ($action == 'add_template') {
        $stmt = $db->prepare("INSERT INTO card_templates (template_name, category, default_text, font_family, font_size, text_color, background_image, is_active) VALUES (?,?,?,?,?,?,?,?)");
        $stmt->execute([$_POST['template_name'], $_POST['category'], $_POST['default_text'], $_POST['font_family'], $_POST['font_size'], $_POST['text_color'], $_POST['background_image'], isset($_POST['is_active'])?1:0]);
        toast("Template ditambahkan", "success");
        redirect("card_templates.php");
    } elseif ($action == 'edit_template') {
        $stmt = $db->prepare("UPDATE card_templates SET template_name=?, category=?, default_text=?, font_family=?, font_size=?, text_color=?, background_image=?, is_active=? WHERE id=?");
        $stmt->execute([$_POST['template_name'], $_POST['category'], $_POST['default_text'], $_POST['font_family'], $_POST['font_size'], $_POST['text_color'], $_POST['background_image'], isset($_POST['is_active'])?1:0, $_POST['id']]);
        toast("Template diupdate", "success");
        redirect("card_templates.php");
    } elseif ($action == 'delete_template') {
        $db->prepare("DELETE FROM card_templates WHERE id=?")->execute([$_POST['id']]);
        toast("Dihapus", "success");
        redirect("card_templates.php");
    }
}
$templates = $db->query("SELECT * FROM card_templates ORDER BY id DESC")->fetchAll();
?>
<?php require_once 'header.php'; ?>

<div class="admin-topbar">
    <h4><i class="fas fa-envelope-open-text me-2"></i> Manajemen Kartu Ucapan</h4>
    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addModal"><i class="fas fa-plus"></i> Template Baru</button>
</div>

<div class="admin-body">
    <div class="table-responsive">
        <table class="table table-bordered table-hover align-middle">
            <thead class="table-light">
                <tr><th>Nama Template</th><th>Kategori</th><th>Teks Default</th><th>Font</th><th>Warna</th><th>Status</th><th>Aksi</th></tr>
            </thead>
            <tbody>
                <?php foreach($templates as $t): ?>
                <tr>
                    <td><?=e($t['template_name'])?></td>
                    <td><?=e($t['category'])?></td>
                    <td><small><?=substr(e($t['default_text']),0,50)?>...</small></td>
                    <td><?=$t['font_family']?>, <?=$t['font_size']?>px</td>
                    <td style="background:<?=$t['text_color']?>; width:40px"></td>
                    <td><?=$t['is_active']?'<span class="badge bg-success">Aktif</span>':'<span class="badge bg-secondary">Nonaktif</span>'?></td>
                    <td>
                        <button class="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#editModal<?=$t['id']?>"><i class="fas fa-edit"></i></button>
                        <form method="post" class="d-inline" onsubmit="return confirm('Yakin hapus?')">
                            <input type="hidden" name="action" value="delete_template">
                            <input type="hidden" name="id" value="<?=$t['id']?>">
                            <button class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></button>
                        </form>
                    </td>
                </tr>
                <!-- Modal Edit -->
                <div class="modal fade" id="editModal<?=$t['id']?>" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <form method="post">
                                <input type="hidden" name="action" value="edit_template">
                                <input type="hidden" name="id" value="<?=$t['id']?>">
                                <div class="modal-header"><h5>Edit Template</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
                                <div class="modal-body">
                                    <div class="mb-2"><label>Nama</label><input type="text" name="template_name" value="<?=e($t['template_name'])?>" class="form-control" required></div>
                                    <div class="mb-2"><label>Kategori</label><input type="text" name="category" value="<?=e($t['category'])?>" class="form-control"></div>
                                    <div class="mb-2"><label>Teks Default</label><textarea name="default_text" class="form-control" rows="3"><?=e($t['default_text'])?></textarea></div>
                                    <div class="mb-2"><label>Font Family</label><input type="text" name="font_family" value="<?=$t['font_family']?>" class="form-control"></div>
                                    <div class="mb-2"><label>Font Size (px)</label><input type="number" name="font_size" value="<?=$t['font_size']?>" class="form-control"></div>
                                    <div class="mb-2"><label>Text Color</label><input type="color" name="text_color" value="<?=$t['text_color']?>" class="form-control form-control-color"></div>
                                    <div class="mb-2"><label>Background Image URL</label><input type="url" name="background_image" value="<?=e($t['background_image'])?>" class="form-control"></div>
                                    <div class="form-check"><input type="checkbox" name="is_active" value="1" <?=$t['is_active']?'checked':''?> class="form-check-input"> <label class="form-check-label">Aktif</label></div>
                                </div>
                                <div class="modal-footer"><button type="submit" class="btn btn-primary">Simpan</button></div>
                            </form>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- Modal Add -->
<div class="modal fade" id="addModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="post">
                <input type="hidden" name="action" value="add_template">
                <div class="modal-header"><h5>Tambah Template Kartu</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
                <div class="modal-body">
                    <div class="mb-2"><label>Nama Template</label><input type="text" name="template_name" required class="form-control"></div>
                    <div class="mb-2"><label>Kategori</label><input type="text" name="category" class="form-control"></div>
                    <div class="mb-2"><label>Teks Default</label><textarea name="default_text" class="form-control" rows="3"></textarea></div>
                    <div class="mb-2"><label>Font Family</label><input type="text" name="font_family" value="Arial" class="form-control"></div>
                    <div class="mb-2"><label>Font Size</label><input type="number" name="font_size" value="16" class="form-control"></div>
                    <div class="mb-2"><label>Text Color</label><input type="color" name="text_color" value="#000000" class="form-control-color"></div>
                    <div class="mb-2"><label>Background Image URL</label><input type="url" name="background_image" class="form-control"></div>
                    <div class="form-check"><input type="checkbox" name="is_active" value="1" checked class="form-check-input"> <label>Aktif</label></div>
                </div>
                <div class="modal-footer"><button type="submit" class="btn btn-primary">Simpan</button></div>
            </form>
        </div>
    </div>
</div>

<?php require_once 'footer.php'; ?>