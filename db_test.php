<?php
// db_test.php - Виправлена версія для твого XAMPP

// Налаштування показу помилок
ini_set('display_errors', 1);
error_reporting(E_ALL);

// --- ВАЖЛИВІ НАЛАШТУВАННЯ ---
$host = 'localhost';
$db   = 'auth_db';      // <-- Переконайся, що у phpMyAdmin база називається саме так!
$user = 'root';
$pass = '';             // <-- Пароль має бути порожнім!
$port = 3307;           // <-- Твій порт
$charset = 'utf8mb4';

// Рядок підключення (додали port=$port)
$dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    // 1. Підключення
    $pdo = new PDO($dsn, $user, $pass, $options);
    echo "<h2 style='color:green'>✅ КРОК 1: Підключення успішне!</h2>";

    // 2. Створення таблиці (код, який ти надіслав)
    $createTableSQL = "
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        phone VARCHAR(20) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";
    
    $pdo->exec($createTableSQL);
    echo "<h2 style='color:green'>✅ КРОК 2: Таблиця 'users' створена або вже існує!</h2>";

    // --- Створюємо таблицю для уподобань (favorites)
    $createFavoritesSQL = "
    CREATE TABLE IF NOT EXISTS favorites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        img VARCHAR(255) DEFAULT NULL,
        price VARCHAR(50) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_product (user_id, product_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";

    $pdo->exec($createFavoritesSQL);
    echo "<h2 style='color:green'>✅ КРОК 3: Таблиця 'favorites' створена або вже існує!</h2>";

    echo "<p>Тепер можна налаштовувати api.php та використовувати кінцеві точки для уподобань.</p>";

} catch (\PDOException $e) {
    // Якщо помилка
    echo "<h2 style='color:red'>❌ ПОМИЛКА:</h2>";
    echo "<h3>" . $e->getMessage() . "</h3>";
    
    if (strpos($e->getMessage(), 'Unknown database') !== false) {
        echo "<p>⚠️ Система не бачить базу даних <b>'$db'</b>. Зайди в phpMyAdmin і створи її, або перевір назву.</p>";
    }
}
?>