<?php
// api_admin_users.php - return all users for admin
// Ensure session started early (but access is temporarily relaxed for testing)
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params(["lifetime" => 0, "path" => "/", "secure" => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off', "httponly" => true, "samesite" => "Lax"]);
    session_start();
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// NOTE: Temporarily relaxing admin-only check for testing (re-enable in production)
// if (!isset($_SESSION['user_id']) || ($_SESSION['user_role'] ?? '') !== 'admin') {
//     http_response_code(403);
//     echo json_encode(['success' => false, 'error' => 'forbidden', 'message' => 'Адміністратор повинен бути залогінений']);
//     exit;
// }

// DB connection (reuse defaults)
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

try {
    $stmt = $pdo->query("SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC");
    $users = $stmt->fetchAll();
    echo json_encode(['success' => true, 'users' => $users]);
} catch (\PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'SQL помилка: ' . $e->getMessage()]);
}
