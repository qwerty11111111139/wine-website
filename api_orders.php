<?php
// api_orders.php - simple orders API
// Ensure session is started before any output to preserve session cookies and state
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params(["lifetime" => 0, "path" => "/", "secure" => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off', "httponly" => true, "samesite" => "Lax"]);
    session_start();
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// DB connection (same defaults as api.php)
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
} catch (\PDOException $e) {
    error_log('DB connection failed: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Помилка підключення до бази даних']);
    exit;
}

// Ensure orders table exists (safe to run)
try {
    $createOrdersSQL = "
        CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT DEFAULT NULL,
            product_name VARCHAR(255) NOT NULL,
            quantity INT NOT NULL DEFAULT 1,
            customer_name VARCHAR(150) NOT NULL,
            email VARCHAR(150) NOT NULL,
            phone VARCHAR(50) DEFAULT NULL,
            status VARCHAR(50) DEFAULT 'new',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX (user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";
    $pdo->exec($createOrdersSQL);
} catch (\PDOException $e) {
    error_log('Failed to ensure orders table: ' . $e->getMessage());
}

$method = $_SERVER['REQUEST_METHOD'];

// Parse JSON body if present
$raw = file_get_contents('php://input');
$input = json_decode($raw, true);
if (!is_array($input)) $input = [];

if ($method === 'POST') {
    // Handle special POST actions (delete) first
    if (isset($input['action']) && $input['action'] === 'delete_order') {
        $order_id = (int)($input['id'] ?? 0);
        if (!$order_id) {
            echo json_encode(['success' => false, 'message' => 'Невірний id замовлення']);
            exit;
        }
        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['success' => false, 'error' => 'not_logged_in', 'message' => 'Будь ласка, увійдіть щоб видалити замовлення']);
            exit;
        }
        $user_id = $_SESSION['user_id'];

        // Verify ownership or admin
        $stmt = $pdo->prepare("SELECT user_id FROM orders WHERE id = ? LIMIT 1");
        $stmt->execute([$order_id]);
        $row = $stmt->fetch();
        if (!$row) {
            echo json_encode(['success' => false, 'message' => 'Замовлення не знайдено']);
            exit;
        }
        if ($row['user_id'] != $user_id && ($_SESSION['user_role'] ?? '') !== 'admin') {
            echo json_encode(['success' => false, 'message' => 'Нема доступу для видалення цього замовлення']);
            exit;
        }

        try {
            $del = $pdo->prepare("DELETE FROM orders WHERE id = ?");
            $del->execute([$order_id]);
            echo json_encode(['success' => true, 'message' => 'Замовлення видалено']);
        } catch (\PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'SQL помилка: ' . $e->getMessage()]);
        }
        exit;
    }

    // Create order
    $product_name = trim($input['product_name'] ?? '');
    $quantity = (int)($input['quantity'] ?? 1);
    $customer_name = trim($input['customer_name'] ?? ($input['name'] ?? '')); 
    $email = trim($input['email'] ?? '');
    $phone = trim($input['phone'] ?? '');

    if ($product_name === '' || $quantity < 1 || $email === '') {
        echo json_encode(['success' => false, 'message' => 'Невірні дані для створення замовлення']);
        exit;
    }

    // Find product to get image
    $stmt = $pdo->prepare("SELECT id, name, image FROM products WHERE name = ? LIMIT 1");
    $stmt->execute([$product_name]);
    $product = $stmt->fetch();

    if (!$product) {
        echo json_encode(['success' => false, 'message' => 'Продукт не знайдено']);
        exit;
    }

    $user_id = $_SESSION['user_id'] ?? null;

    // If user not logged in but email corresponds to a user, attach it
    if (!$user_id && $email !== '') {
        $u = $pdo->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
        $u->execute([$email]);
        $found = $u->fetch();
        if ($found) $user_id = $found['id'];
    }

    try {
        $insert = $pdo->prepare("INSERT INTO orders (user_id, product_name, quantity, customer_name, email, phone, status) VALUES (?, ?, ?, ?, ?, ?, 'new')");
        $insert->execute([$user_id, $product_name, $quantity, $customer_name, $email, $phone]);
        $order_id = $pdo->lastInsertId();

        echo json_encode([
            'success' => true,
            'order' => [
                'id' => (int)$order_id,
                'product_name' => $product_name,
                'quantity' => $quantity,
                'customer_name' => $customer_name,
                'email' => $email,
                'phone' => $phone,
                'image' => $product['image'] ?? null,
                'created_at' => date('Y-m-d H:i:s')
            ]
        ]);
    } catch (\PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'SQL помилка: ' . $e->getMessage()]);
    }
    exit;
}

if ($method === 'GET') {
    // Return orders for current user
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'not_logged_in', 'message' => 'Будь ласка, увійдіть, щоб переглянути замовлення']);
        exit;
    }

    $user_id = $_SESSION['user_id'];

    try {
        $q = "SELECT o.id, o.product_name, o.quantity, o.customer_name, o.email, o.phone, o.status, o.created_at, p.image
              FROM orders o
              LEFT JOIN products p ON p.name = o.product_name
              WHERE o.user_id = ?
              ORDER BY o.created_at DESC";
        $stmt = $pdo->prepare($q);
        $stmt->execute([$user_id]);
        $orders = $stmt->fetchAll();

        echo json_encode(['success' => true, 'orders' => $orders]);
    } catch (\PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'SQL помилка: ' . $e->getMessage()]);
    }
    exit;
}

// Unsupported method
http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
