<?php

session_start();
$db = new PDO('mysql:host=localhost;dbname=florabelle_db;charset=utf8', 'root', '');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

function isLoggedIn()
{
    return isset($_SESSION['user_id']);
}
function isAdmin()
{
    return isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
}
function redirect($url)
{
    header("Location: $url");
    exit;
}
function rupiah($n)
{
    return 'Rp '.number_format($n, 0, ',', '.');
}
function e($s)
{
    return htmlspecialchars($s ?? '', ENT_QUOTES, 'UTF-8');
}
function toast($msg, $type = 'success')
{
    $_SESSION['toast'] = ['msg' => $msg, 'type' => $type];
}
function getToast()
{
    if (isset($_SESSION['toast'])) {
        $t = $_SESSION['toast'];
        unset($_SESSION['toast']);

        return $t;
    }

    return null;
}
function cardGradient($cat)
{
    $m = ['Bunga Potong' => 'linear-gradient(135deg,#fce4ec,#f8bbd0)', 'Buket' => 'linear-gradient(135deg,#fff3e0,#ffe0b2)', 'Bunga Pot' => 'linear-gradient(135deg,#e8f5e9,#c8e6c9)', 'Rangkaian' => 'linear-gradient(135deg,#e0f7fa,#b2ebf2)'];

    return isset($m[$cat]) ? $m[$cat] : 'linear-gradient(135deg,#f3e5f5,#e1bee7)';
}
$cart_count = 0;
if (isLoggedIn()) {
    $c = $db->prepare('SELECT SUM(quantity) FROM cart WHERE user_id=?');
    $c->execute([$_SESSION['user_id']]);
    $cart_count = $c->fetchColumn() ?: 0;
}

function timeAgo($timestamp)
{
    $time_ago = strtotime($timestamp);
    $current_time = time();
    $time_difference = $current_time - $time_ago;
    $seconds = $time_difference;
    $minutes = round($seconds / 60);
    $hours = round($seconds / 3600);
    $days = round($seconds / 86400);
    $weeks = round($seconds / 604800);
    $months = round($seconds / 2629440);
    $years = round($seconds / 31553280);
    if ($seconds <= 60) {
        return 'Baru saja';
    } elseif ($minutes <= 60) {
        return $minutes == 1 ? '1 menit lalu' : "$minutes menit lalu";
    } elseif ($hours <= 24) {
        return $hours == 1 ? '1 jam lalu' : "$hours jam lalu";
    } elseif ($days <= 7) {
        return $days == 1 ? 'kemarin' : "$days hari lalu";
    } elseif ($weeks <= 4.3) {
        return $weeks == 1 ? '1 minggu lalu' : "$weeks minggu lalu";
    } elseif ($months <= 12) {
        return $months == 1 ? '1 bulan lalu' : "$months bulan lalu";
    } else {
        return $years == 1 ? '1 tahun lalu' : "$years tahun lalu";
    }
}

$toast = getToast();
