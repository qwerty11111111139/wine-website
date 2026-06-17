<?php
// join_club.php - Minimal handler for Private Club applications
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

// Quick early debug so we know this file executed
$debugPath = __DIR__ . DIRECTORY_SEPARATOR . 'club_debug.log';
@file_put_contents($debugPath, json_encode(['at'=>date('c'),'note'=>'join_club.php invoked']) . PHP_EOL, FILE_APPEND | LOCK_EX);

// Read JSON body or fallback to form-encoded
$raw = file_get_contents('php://input');
$input = json_decode($raw, true);
if (!is_array($input) || empty($input)) {
    $input = $_POST ?? [];
}

$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$phone = trim($input['phone'] ?? '');
$message = trim($input['message'] ?? '');

$debugPath = __DIR__ . DIRECTORY_SEPARATOR . 'club_debug.log';
@file_put_contents($debugPath, json_encode(['at' => date('c'), 'incoming' => $input], JSON_UNESCAPED_UNICODE) . PHP_EOL, FILE_APPEND | LOCK_EX);

if (empty($name) || empty($email) || empty($phone) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    @file_put_contents($debugPath, json_encode(['at' => date('c'), 'error' => 'validation_failed', 'data' => [$name,$email,$phone]], JSON_UNESCAPED_UNICODE) . PHP_EOL, FILE_APPEND | LOCK_EX);
    echo json_encode(['success' => false, 'message' => 'Невірні дані']);
    exit;
}

// DB connection (match api.php settings)
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
} catch (PDOException $e) {
    @file_put_contents($debugPath, json_encode(['at'=>date('c'),'error'=>'db_connect','msg'=>$e->getMessage()], JSON_UNESCAPED_UNICODE) . PHP_EOL, FILE_APPEND | LOCK_EX);
    echo json_encode(['success' => false, 'message' => 'Помилка підключення до бази даних']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO club_applications (name, email, phone, message, status) VALUES (?, ?, ?, ?, 'pending')");
    $stmt->execute([$name, $email, $phone, $message]);
    $id = (int)$pdo->lastInsertId();

    @file_put_contents($debugPath, json_encode(['at'=>date('c'),'inserted'=>['id'=>$id,'name'=>$name,'email'=>$email]], JSON_UNESCAPED_UNICODE) . PHP_EOL, FILE_APPEND | LOCK_EX);

    echo json_encode(['success' => true, 'message' => 'Заявку збережено', 'id' => $id]);
} catch (PDOException $e) {
    @file_put_contents($debugPath, json_encode(['at'=>date('c'),'error'=>'insert_failed','msg'=>$e->getMessage()], JSON_UNESCAPED_UNICODE) . PHP_EOL, FILE_APPEND | LOCK_EX);
    echo json_encode(['success' => false, 'message' => 'SQL помилка: ' . $e->getMessage()]);
}
