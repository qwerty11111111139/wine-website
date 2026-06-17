<?php
// 1. Налаштовуємо та стартуємо сесію (ідентично до api.php)
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

// Дозволити тестове відображення VIP-модалки без авторизації через параметр ?vip_preview=1
$forceVipPreview = isset($_GET['vip_preview']) && $_GET['vip_preview'] === '1';
$fakeVipPreview = false;

// 2. Перевіряємо, чи користувач взагалі авторизований
if (!isset($_SESSION['user_id'])) {
    if ($forceVipPreview) {
        // У режимі попереднього перегляду дозволяємо завантажити шаблон без повної сесії
        $fakeVipPreview = true;
    } else {
        // Якщо сесії немає, перенаправляємо на головну
        header('Location: index.html');
        exit;
    }
}

// 3. Підключаємо базу даних безпосередньо, бо в цьому проекті немає PDO-конфігурації в окремому файлі
$host = '127.0.0.1';
$db   = 'auth_db';
$user = 'root';
$pass = '';
$port = 3307;
$charset = 'utf8mb4';
$dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);

    if ($fakeVipPreview) {
        $user = [
            'name' => 'VIP Гість',
            'email' => 'vip@example.com',
            'phone' => '+380000000000',
            'is_club_member' => 1,
            'letter_shown' => 0,
            'is_vip' => 1,
            'bonuses' => 0,
        ];
    } else {
        // 4. Обробляємо POST-запит на підтвердження VIP-запрошення
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['accept_vip']) && isset($_SESSION['user_id'])) {
            $update = $pdo->prepare("UPDATE users SET is_vip = 1, bonuses = bonuses + 500, letter_shown = 1 WHERE id = ?");
            $update->execute([$_SESSION['user_id']]);

            $_SESSION['user_is_vip'] = 1;
            $_SESSION['user_bonuses'] = ($_SESSION['user_bonuses'] ?? 0) + 500;

            header('Location: cabinet.php');
            exit;
        }

        // 5. Беремо ID з сесії та шукаємо користувача в базі
        $userId = $_SESSION['user_id'];
        $stmt = $pdo->prepare("SELECT name, email, phone, is_club_member, letter_shown, is_vip, bonuses FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    if ($user) {
        // 5. Заповнюємо змінні для шаблону cabinet_view.php
        $name = htmlspecialchars($user['name'] ?? '');
        $email = htmlspecialchars($user['email'] ?? '');
        $phone = htmlspecialchars($user['phone'] ?? '');
        $avatarUrl = 'img1/vynohradnyk.jpg';
        
        // Клубний статус та бонуси
        $isClub = (int)($user['is_club_member'] ?? 0);
        $letterShown = (int)($user['letter_shown'] ?? 0);
        $isVip = (int)($user['is_vip'] ?? 0);
        $bonuses = (int)($user['bonuses'] ?? 0);

        $_SESSION['user_is_vip'] = $isVip;
        $_SESSION['user_bonuses'] = $bonuses;

        $show_vip_letter = ($isClub === 1 && $letterShown === 0 && $isVip === 0);
        $vipStatus = $isVip ? "VIP Учасник клубу" : "(не є учасником клубу)";
    } else {
        // Якщо юзера з таким ID чомусь немає в базі
        session_destroy();
        header('Location: index.html');
        exit;
    }
} catch (PDOException $e) {
    die("Помилка бази даних: " . $e->getMessage());
}

if ($fakeVipPreview) {
    $show_vip_letter = true;
}

// 7. Підключаємо візуальний шаблон, який все це виведе
require_once 'cabinet_view.php';
?>