<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$db = new SQLite3('users.db');
$db->exec('CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)');

function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

// Реєстрація
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'register') {
    $data = json_decode(file_get_contents('php://input'), true);
    $name = trim($data['name'] ?? '');
    $phone = trim($data['phone'] ?? '');
    $password = $data['password'] ?? '';
    $password_confirm = $data['password_confirm'] ?? '';
    if (empty($name) || empty($phone) || empty($password) || empty($password_confirm)) {
        echo json_encode(['success' => false, 'message' => 'Всі поля обов\'язкові']);
        exit;
    }
    if ($password !== $password_confirm) {
        echo json_encode(['success' => false, 'message' => 'Паролі не співпадають']);
        exit;
    }
    if (strlen($password) < 6) {
        echo json_encode(['success' => false, 'message' => 'Пароль мінімум 6 символів']);
        exit;
    }
    $stmt = $db->prepare('SELECT id FROM users WHERE phone = ?');
    $stmt->bindValue(1, $phone, SQLITE3_TEXT);
    $result = $stmt->execute();
    if ($result->fetchArray()) {
        echo json_encode(['success' => false, 'message' => 'Користувач з таким телефоном вже існує']);
        exit;
    }
    $hashedPassword = hashPassword($password);
    $stmt = $db->prepare('INSERT INTO users (name, phone, password) VALUES (?, ?, ?)');
    $stmt->bindValue(1, $name, SQLITE3_TEXT);
    $stmt->bindValue(2, $phone, SQLITE3_TEXT);
    $stmt->bindValue(3, $hashedPassword, SQLITE3_TEXT);
    if ($stmt->execute()) {
        $user_id = $db->lastInsertRowID();
        session_start();
        $_SESSION['user_id'] = $user_id;
        $_SESSION['user_name'] = $name;
        $_SESSION['user_phone'] = $phone;
        echo json_encode(['success' => true, 'message' => 'Реєстрація успішна. Ви увійшли!', 'user' => [
            'id' => $user_id,
            'name' => $name,
            'phone' => $phone
        ]]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Помилка реєстрації']);
    }
    exit;
}

// Вхід
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'login') {
    $data = json_decode(file_get_contents('php://input'), true);
    $phone = trim($data['phone'] ?? '');
    $password = $data['password'] ?? '';
    if (empty($phone) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Телефон та пароль обов\'язкові']);
        exit;
    }
    $stmt = $db->prepare('SELECT id, name, phone, password FROM users WHERE phone = ?');
    $stmt->bindValue(1, $phone, SQLITE3_TEXT);
    $result = $stmt->execute();
    $user = $result->fetchArray(SQLITE3_ASSOC);
    if ($user && verifyPassword($password, $user['password'])) {
        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_phone'] = $user['phone'];
        echo json_encode(['success' => true, 'message' => 'Вхід успішний', 'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'phone' => $user['phone']
        ]]);
    } else {
        if (!$user) {
            echo json_encode(['success' => false, 'message' => 'Вам потрібно зареєструватись', 'need_register' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Невірний телефон або пароль']);
        }
    }
    exit;
}

// Перевірка сесії
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'check_session') {
    session_start();
    if (isset($_SESSION['user_id'])) {
        echo json_encode(['logged_in' => true, 'user' => [
            'id' => $_SESSION['user_id'],
            'name' => $_SESSION['user_name'],
            'phone' => $_SESSION['user_phone']
        ]]);
    } else {
        echo json_encode(['logged_in' => false]);
    }
    exit;
}

// Вихід
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_start();
    session_destroy();
    echo json_encode(['success' => true, 'message' => 'Вихід успішний']);
    exit;
}

echo json_encode(['error' => 'Невірний запит']);
