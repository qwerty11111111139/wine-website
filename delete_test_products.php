<?php
// delete_test_products.php
// Run from command line: php delete_test_products.php

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
    echo "DB connection failed: " . $e->getMessage() . PHP_EOL;
    exit(1);
}

$names = ['Назва вина 11', 'Назва вина 12'];

try {
    // Find product ids
    $placeholders = rtrim(str_repeat('?,', count($names)), ',');
    $stmt = $pdo->prepare("SELECT id, name FROM products WHERE name IN ($placeholders)");
    $stmt->execute($names);
    $rows = $stmt->fetchAll();

    if (empty($rows)) {
        echo "No matching products found." . PHP_EOL;
        exit(0);
    }

    $ids = array_column($rows, 'id');
    echo "Found products to delete:" . PHP_EOL;
    foreach ($rows as $r) echo "- ({$r['id']}) {$r['name']}" . PHP_EOL;

    // Delete favorites referencing them
    $delFav = $pdo->prepare("DELETE FROM favorites WHERE product_id = ?");
    foreach ($ids as $id) {
        $delFav->execute([$id]);
    }

    // Delete products
    $in = rtrim(str_repeat('?,', count($ids)), ',');
    $del = $pdo->prepare("DELETE FROM products WHERE id IN ($in)");
    $del->execute($ids);

    echo "Deleted products and related favorites for IDs: " . implode(', ', $ids) . PHP_EOL;
} catch (PDOException $e) {
    echo "SQL error: " . $e->getMessage() . PHP_EOL;
    exit(1);
}

return 0;
