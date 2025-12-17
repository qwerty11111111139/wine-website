<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require_once __DIR__ . '/PHPMailer/Exception.php';
require_once __DIR__ . '/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/SMTP.php';

// api.php - Фінальна версія для MySQL (Port 3307)

// 1. Налаштування заголовків (CORS)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Обробка preflight-запитів (для коректної роботи AJAX)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// 2. ПІДКЛЮЧЕННЯ ДО БАЗИ
$host = 'localhost';
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
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Помилка бази даних: ' . $e->getMessage()]);
    exit;
}

// Старт сесії для всіх запитів
session_start();
// NOTE: sessions are started but PERSIST_SESSIONS is disabled by default.
//       With the default configuration a page reload will NOT preserve the logged-in state.
//       To enable persistent sessions across reloads set the environment variable PERSIST_SESSIONS=1.

// Отримуємо JSON дані від JS
$data = json_decode(file_get_contents("php://input"), true);
$action = $_GET['action'] ?? '';

// =========================================================
// 3. РЕЄСТРАЦІЯ
// =========================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'register') {
    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $phone = trim($data['phone'] ?? '');
    $password = $data['password'] ?? '';
    $password_confirm = $data['password_confirm'] ?? '';

    // Валідація
    if (empty($name) || empty($email) || empty($phone) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Всі поля обов\'язкові!']);
        exit;
    }
    if ($password !== $password_confirm && !empty($password_confirm)) {
        echo json_encode(['success' => false, 'message' => 'Паролі не співпадають']);
        exit;
    }
    if (strlen($password) < 6) {
        echo json_encode(['success' => false, 'message' => 'Пароль має бути мінімум 6 символів']);
        exit;
    }

    // Перевірка, чи існує email
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Цей Email вже зареєстрований']);
        exit;
    }

    // Додавання в базу
    try {
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $sql = "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        
        if ($stmt->execute([$name, $email, $phone, $passwordHash])) {
            $user_id = $pdo->lastInsertId();
            
            // Optionally persist session for multiple page loads (disabled by default).
            // Set environment variable PERSIST_SESSIONS=1 to enable persistence across reloads.
            if (getenv('PERSIST_SESSIONS') === '1') {
                $_SESSION['user_id'] = $user_id;
                $_SESSION['user_name'] = $name;
                $_SESSION['user_email'] = $email;
            }

            echo json_encode(['success' => true, 'message' => 'Реєстрація успішна!']);
        }
    } catch (\PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Помилка SQL: ' . $e->getMessage()]);
    }
    exit;
}

// =========================================================
// 4. ВХІД (LOGIN)
// =========================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'login') {
    $login = trim($data['email'] ?? $data['phone'] ?? '');
    $password = $data['password'] ?? '';

    if (empty($login) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Введіть Email та пароль']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? OR phone = ?");
    $stmt->execute([$login, $login]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        // Optionally persist session for multiple page loads (disabled by default).
        // Set environment variable PERSIST_SESSIONS=1 to enable persistence across reloads.
        if (getenv('PERSIST_SESSIONS') === '1') {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['user_email'] = $user['email'];
        }

        // ПЕРЕВІРКА НА АДМІНА
        $role = ($user['email'] === 'admin@gmail.com') ? 'admin' : 'user';

        echo json_encode([
            'success' => true, 
            'message' => 'Вхід успішний',
            'role' => $role,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email']
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Невірний логін або пароль']);
    }
    exit;
}
// =========================================================
// 7. ДОДАТИ УПОДОБАНЕ (add_favorite)
// =========================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'add_favorite') {
    // Потрібно бути авторизованим (сесією)
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'not_logged_in', 'message' => 'Будь ласка, увійдіть, щоб додати в обране']);
        exit;
    }

    $user_id = $_SESSION['user_id'];
    $product_id = trim($data['product_id'] ?? '');
    $name = trim($data['name'] ?? '');
    $img = trim($data['img'] ?? '');
    $price = trim($data['price'] ?? '');

    if (empty($product_id) || empty($name)) {
        echo json_encode(['success' => false, 'message' => 'Необхідний product_id та name']);
        exit;
    }

    try {
        // Перевіряємо, чи вже є уподобання
        $stmt = $pdo->prepare("SELECT id FROM favorites WHERE user_id = ? AND product_id = ?");
        $stmt->execute([$user_id, $product_id]);
        if ($stmt->fetch()) {
            echo json_encode(['success' => true, 'message' => 'Вже у вподобаних']);
            exit;
        }

        // Додаємо (тепер з полем price)
        $insert = $pdo->prepare("INSERT INTO favorites (user_id, product_id, name, img, price) VALUES (?, ?, ?, ?, ?)");
        $insert->execute([$user_id, $product_id, $name, $img, $price]);

        echo json_encode(['success' => true, 'message' => 'Додано в обране', 'favorite' => ['product_id' => $product_id, 'name' => $name, 'img' => $img, 'price' => $price]]);
    } catch (\PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'SQL помилка: ' . $e->getMessage()]);
    }
    exit;
}

// =========================================================
// 8. ВИДАЛИТИ УПОДОБАНЕ (remove_favorite)
// =========================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'remove_favorite') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'not_logged_in', 'message' => 'Будь ласка, увійдіть, щоб видалити з обраного']);
        exit;
    }

    $user_id = $_SESSION['user_id'];
    $product_id = trim($data['product_id'] ?? '');

    if (empty($product_id)) {
        echo json_encode(['success' => false, 'message' => 'product_id обов\'язковий']);
        exit;
    }

    try {
        $del = $pdo->prepare("DELETE FROM favorites WHERE user_id = ? AND product_id = ?");
        $del->execute([$user_id, $product_id]);
        echo json_encode(['success' => true, 'message' => 'Видалено з обраного']);
    } catch (\PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'SQL помилка: ' . $e->getMessage()]);
    }
    exit;
}

// =========================================================
// 9. ОТРИМАТИ УПОДОБАНІ (get_favorites)
// =========================================================
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'get_favorites') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'not_logged_in', 'message' => 'Будь ласка, увійдіть щоб переглянути обране']);
        exit;
    }

    $user_id = $_SESSION['user_id'];

    try {
        $stmt = $pdo->prepare("SELECT product_id, name, img, price, created_at FROM favorites WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$user_id]);
        $favorites = $stmt->fetchAll();

        echo json_encode(['success' => true, 'favorites' => $favorites]);
    } catch (\PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'SQL помилка: ' . $e->getMessage()]);
    }
    exit;
}
// =========================================================
// SUBSCRIBE (newsletter) - send welcome email using PHPMailer
// =========================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'subscribe') {
    $email = trim($data['email'] ?? '');

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Невірний email']);
        exit;
    }



    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'd33308645@gmail.com';
        $mail->Password   = 'csevjuaxhcndyngt'; // App Password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        // Recipients
        $mail->setFrom('d33308645@gmail.com', 'Dionysus Cellar');
        $mail->addAddress($email);

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Welcome to Dionysus Cellar';
        $mail->Body    = '<b>Thank you for subscribing!</b><br>Welcome to our community.';

        // Allow self-signed certificates for local development (XAMPP)
        $mail->SMTPOptions = array(
            'ssl' => array(
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            )
        );

        $mail->send();
        echo json_encode(['success' => true, 'message' => 'Subscription successful, email sent.']);
    } catch (Exception $e) {
        // Do not expose sensitive errors to client; log if needed
        error_log('Mailer Error: ' . $mail->ErrorInfo . ' Exception: ' . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Message could not be sent.']);
    }
    exit;
}

// =========================================================
// 5. ПЕРЕВІРКА СЕСІЇ
// =========================================================
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'check_session') {
    if (isset($_SESSION['user_id'])) {
        echo json_encode([
            'logged_in' => true,
            'user' => [
                'id' => $_SESSION['user_id'],
                'name' => $_SESSION['user_name'],
                'email' => $_SESSION['user_email'] ?? ''
            ]
        ]);
    } else {
        echo json_encode(['logged_in' => false]);
    }
    exit;
}

// =========================================================
// 6. ВИХІД (LOGOUT) - ПОВНЕ ОЧИЩЕННЯ
// =========================================================
if ($action === 'logout') {
    // 1. Очищаємо масив сесії
    $_SESSION = [];

    // 2. Якщо використовується cookie для сесії, видаляємо її
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }

    // 3. Знищуємо сесію на сервері
    session_unset();
    session_destroy();

    echo json_encode(['success' => true, 'message' => 'Вихід успішний']);
    exit;
}
?>