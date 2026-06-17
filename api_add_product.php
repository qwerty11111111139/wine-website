<?php
// api_add_product.php - handle multipart/form-data POST to add a new product with image upload
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// DB connection (reuse same settings as api.php)
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
    echo json_encode(['success' => false, 'message' => 'Помилка підключення до БД']);
    exit;
}

// Ensure products table has country and region columns (best-effort)
try {
    $pdo->exec("ALTER TABLE products ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT NULL");
    $pdo->exec("ALTER TABLE products ADD COLUMN IF NOT EXISTS region VARCHAR(100) DEFAULT NULL");
} catch (\PDOException $e) {
    // ignore if unable to alter (older MySQL may not support IF NOT EXISTS); not fatal
}

$name = trim($_POST['name'] ?? '');
$price = isset($_POST['price']) ? trim($_POST['price']) : '';
$category = trim($_POST['category'] ?? '');
$country = trim($_POST['country'] ?? '');
$region = trim($_POST['region'] ?? '');
$description = trim($_POST['description'] ?? '');

if ($name === '' || $price === '' || $category === '') {
    echo json_encode(['success' => false, 'message' => 'Назва, ціна та категорія обов\'язкові']);
    exit;
}

// Handle file upload if provided
$imagePath = null;
if (!empty($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
    $fileInfo = $_FILES['image'];

    if ($fileInfo['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['success' => false, 'message' => 'Помилка при завантаженні файлу']);
        exit;
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $fileInfo['tmp_name']);
    finfo_close($finfo);

    $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/gif' => 'gif', 'image/webp' => 'webp'];
    if (!array_key_exists($mime, $allowed)) {
        echo json_encode(['success' => false, 'message' => 'Недопустимий тип файлу']);
        exit;
    }

    $ext = $allowed[$mime];
    $uploadsDir = __DIR__ . '/assets/img/wines';
    if (!is_dir($uploadsDir)) {
        if (!mkdir($uploadsDir, 0755, true)) {
            echo json_encode(['success' => false, 'message' => 'Не вдалося створити директорію для зображень']);
            exit;
        }
    }

    $filename = uniqid('wine_', true) . '.' . $ext;
    $destination = $uploadsDir . '/' . $filename;
    if (!move_uploaded_file($fileInfo['tmp_name'], $destination)) {
        echo json_encode(['success' => false, 'message' => 'Не вдалося перемістити файл']);
        exit;
    }

    // Save relative path for DB
    $imagePath = 'assets/img/wines/' . $filename;
}

try {
    $stmt = $pdo->prepare("INSERT INTO products (name, price, image, category, description, country, region) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$name, $price, $imagePath, $category, $description, $country, $region]);
    $insertId = $pdo->lastInsertId();
    echo json_encode(['success' => true, 'id' => $insertId]);
} catch (\PDOException $e) {
    error_log('Insert product failed: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Помилка при збереженні товару']);
}
