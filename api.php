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

// Ініціалізація сесії і парсинг вхідних даних
// Ensure session cookie is session-only (expires on browser close)
if (session_status() === PHP_SESSION_NONE) {
    // Explicitly set cookie lifetime to 0 to avoid persistent session cookies
    session_set_cookie_params(["lifetime" => 0, "path" => "/", "secure" => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off', "httponly" => true, "samesite" => "Lax"]);
    session_start();
}

// Обробка вхідних даних JSON від fetch()
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

// Якщо JSON порожній або не є масивом, пробуємо отримати дані через $_POST (для старих форм)
if (!is_array($input) || empty($input)) {
    $input = $_POST ?? [];
}

// For backward compatibility assign $data to $input
$data = $input;

// Визначаємо action: пріоритет - query string, потім JSON payload, потім старі форми
$action = $_GET['action'] ?? ($input['action'] ?? ($data['action'] ?? $_REQUEST['action'] ?? null));

// 2. ПІДКЛЮЧЕННЯ ДО БАЗИ
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
    // Log and return a generic error (no debug output)
    error_log('DB connection failed: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Помилка підключення до бази даних']);
    exit;
}

// Ensure `orders` table exists (created automatically on first run)
try {
    $createOrdersSQL = "
        CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT DEFAULT NULL,
            product_name VARCHAR(255) NOT NULL,
            quantity INT NOT NULL DEFAULT 1,
            customer_name VARCHAR(150) NOT NULL,
            email VARCHAR(150) NOT NULL,
            phone VARCHAR(50) NOT NULL,
            status ENUM('new','completed') NOT NULL DEFAULT 'new',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX (user_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ";

            $pdo->exec($createOrdersSQL);
        } catch (\PDOException $e) {
            // Log but do not abort the request — table creation may require privileges
            error_log('Failed to ensure orders table: ' . $e->getMessage());
        }

        // Ensure `products` table exists and seed it if empty (auto-fill from frontend data)
        try {
            $createProductsSQL = "
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10,2) NOT NULL DEFAULT 0,
                image VARCHAR(255) DEFAULT NULL,
                category VARCHAR(100) DEFAULT 'Вино',
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            ";
            $pdo->exec($createProductsSQL);

            // If table is empty, insert default wines (keeps in sync with site hardcoded `wineData`)
            $countStmt = $pdo->query("SELECT COUNT(*) as cnt FROM products");
            $count = (int)$countStmt->fetchColumn();
            if ($count === 0) {
                $products = [
                    ['Romanée-Conti', ' 980.000', 'img1/Romanée-Conti.jpg', 'Вино', 'імат традицією, де мальовничо приелися, а вірогідні і таємничі'],
                    ['Pétrus', '  850.000', 'img1/Pétrus.jpg', 'Вино', 'Детальний опис вина 2.'],
                    ['Screaming Eagle', '750.000', 'img1/Screaming Eagle.jpg', 'Вино', 'Детальний опис вина 3.'],
                    ['Château Margaux', ' 620.000', 'img1/Château Margaux.jpg', 'Вино', 'Детальний опис вина 4.'],
                    ['Château Lafite Rothschild', '650.000', 'img1/Chateau Lafite Rothshild.jpg', 'Вино', 'Детальний опис вина 5.'],
                    ['Penfolds Grange', '580.000', 'img1/Penfolds Grange.jpg', 'Вино', 'Детальний опис вина 6.'],
                    ['Masseto', ' 720.000', 'img1/Masseto.jpg', 'Вино', 'Детальний опис вина 7.'],
                    ['Vega Sicilia Único', '540.000', 'img1/Vega Sicilia Único.jpg', 'Вино', 'Детальний опис вина 8.'],
                    ['Domaine de la Romanée-Conti Montrachet', '890.000', 'img1/Domaine de la Romanée-Conti Montrachet.jpg', 'Вино', 'Детальний опис вина 9.'],
                    ['Domaine Leflaive Chevalier-Montrachet', ' 510 000', 'img1/Domaine Leflaive Chevalier-Montrachet.jpg', 'Вино', 'Детальний опис вина 10.'],
                    ['Назва вина 11', '700.00', 'img1/wine11.jpg', 'Вино', 'Детальний опис вина 11.'],
                    ['Назва вина 12', '880.00', 'img1/wine12.jpg', 'Вино', 'Детальний опис вина 12.'],
                    ['Louis Roederer Cristal', ' 480.000', 'img1/Louis Roederer Cristal.jpg', 'Вино', 'Детальний опис вина 13.'],
                    ['Salon Le Mesnil Blanc de Blancs', '420.000', 'img1/Salon Le Mesnil Blanc de Blancs.jpg', 'Вино', 'Детальний опис вина 14.'],
                    ['Armand de Brignac', '395.000', 'img1/Armand de Brignac.jpg', 'Вино', 'Детальний опис вина 15.'],
                    ['Bollinger Vieilles Vignes Françaises', '450.000', 'img1/Bollinger Vieilles Vignes Françaises.jpg', 'Вино', 'Детальний опис вина 16.'],
                    ['Château d’Yquem', '520.000', 'img1/Château d’Yquem.jpg', 'Вино', 'Детальний опис вина 17.'],
                    ['Royal Tokaji Essencia', '610.000', 'img1/Royal Tokaji Essencia.jpg', 'Вино', 'Детальний опис вина 18.'],
                    ['Penfolds 50 Year Old Rare Tawny', '680.000', 'img1/Penfolds 50 Year Old Rare Tawny.jpg', 'Вино', 'Детальний опис вина 19.'],
                    ['Quinta do Noval Nacional Vintage Port', '560.000', 'img1/Quinta do Noval Nacional Vintage Port.jpg', 'Вино', 'Детальний опис вина 20.'],
                ];

                $insert = $pdo->prepare("INSERT INTO products (name, price, image, category, description) VALUES (?, ?, ?, ?, ?)");
                foreach ($products as $p) {
                    try {
                        $insert->execute($p);
                    } catch (\PDOException $e) {
                        error_log('Product insert failed: ' . $e->getMessage());
                    }
                }
            }
        } catch (\PDOException $e) {
            error_log('Failed to ensure products table or seed: ' . $e->getMessage());
        }

        // Ensure users table exists
        try {
            $createUsersSQL = "
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                phone VARCHAR(50) DEFAULT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                is_club_member TINYINT(1) NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            ";
            $pdo->exec($createUsersSQL);

            // Ensure is_club_member column exists on older installations
            try {
                $pdo->exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_club_member TINYINT(1) NOT NULL DEFAULT 0");
            } catch (PDOException $e) {
                // Some MySQL versions may not support IF NOT EXISTS - try naive add and ignore failure
                try { $pdo->exec("ALTER TABLE users ADD COLUMN is_club_member TINYINT(1) NOT NULL DEFAULT 0"); } catch (PDOException $e2) { /* ignore */ }
            }
        } catch (\PDOException $e) {
            error_log('Failed to ensure users table: ' . $e->getMessage());
        }

        // Ensure favorites table exists
        try {
            $createFavoritesSQL = "
            CREATE TABLE IF NOT EXISTS favorites (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                product_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                img VARCHAR(255),
                price VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            ";
            $pdo->exec($createFavoritesSQL);
        } catch (\PDOException $e) {
            error_log('Failed to ensure favorites table: ' . $e->getMessage());
        }

        // Ensure `club_applications` table exists for Private Club invitations
        try {
            $createClubSQL = "
            CREATE TABLE IF NOT EXISTS club_applications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                experience VARCHAR(50),
                message TEXT,
                status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            ";
            $pdo->exec($createClubSQL);
        } catch (\PDOException $e) {
            error_log('Failed to ensure club_applications table: ' . $e->getMessage());
        }

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

            // Persist session after successful registration
            $_SESSION['user_id'] = $user_id;
            $_SESSION['user_name'] = $name;
            $_SESSION['user_email'] = $email;

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

    // Explicitly select the role column to ensure it is returned
    $stmt = $pdo->prepare("SELECT id, name, email, role, password, is_club_member FROM users WHERE email = ? OR phone = ?");
    $stmt->execute([$login, $login]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        // Determine role from DB if available, fallback to legacy check
        $role = $user['role'] ?? (($user['email'] === 'admin@gmail.com') ? 'admin' : 'user');

        // Persist session after successful login
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_role'] = $role;
        // Force integer type for the membership flag
        $_SESSION['is_club_member'] = (int)($user['is_club_member'] ?? 0);

        echo json_encode([
            'success' => true, 
            'message' => 'Вхід успішний',
            'role' => $role,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $role,
                'is_club_member' => (int)($user['is_club_member'] ?? 0)
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Невірний логін або пароль']);
    }
    exit;
}
// =========================================================
// UPDATE PROFILE (POST) - ?action=update_profile
// Requires user to be logged in via session
// Accepts JSON: { name?: string|null, email?: string|null, password?: string }
// Returns updated user object on success
// =========================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'update_profile') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'not_logged_in', 'message' => 'Будь ласка, увійдіть щоб оновити профіль']);
        exit;
    }

    $user_id = $_SESSION['user_id'];
    $name = array_key_exists('name', $data) ? trim($data['name']) : null;
    $email = array_key_exists('email', $data) ? trim($data['email']) : null;
    $password = array_key_exists('password', $data) ? $data['password'] : null;

    if (($name === null || $name === '') && ($email === null || $email === '') && ($password === null || $password === '')) {
        echo json_encode(['success' => false, 'message' => 'Немає даних для оновлення']);
        exit;
    }

    try {
        // If email provided, validate format and uniqueness
        if ($email !== null && $email !== '') {
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                echo json_encode(['success' => false, 'message' => 'Невірний формат email']);
                exit;
            }

            $check = $pdo->prepare("SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1");
            $check->execute([$email, $user_id]);
            if ($check->fetch()) {
                echo json_encode(['success' => false, 'message' => 'Цей email вже використовується']);
                exit;
            }
        }

        $fields = [];
        $params = [];
        if ($name !== null && $name !== '') { $fields[] = 'name = ?'; $params[] = $name; }
        if ($email !== null && $email !== '') { $fields[] = 'email = ?'; $params[] = $email; }
        if ($password !== null && $password !== '') {
            if (strlen($password) < 6) {
                echo json_encode(['success' => false, 'message' => 'Пароль має бути не менше 6 символів']);
                exit;
            }
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            $fields[] = 'password = ?';
            $params[] = $passwordHash;
        }

        if (empty($fields)) {
            echo json_encode(['success' => false, 'message' => 'Немає даних для оновлення']);
            exit;
        }

        $params[] = $user_id;
        $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        // Fetch updated user
        $stmt = $pdo->prepare("SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch();

        // Update session values
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_email'] = $user['email'];

        echo json_encode(['success' => true, 'user' => $user, 'message' => 'Профіль оновлено']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'SQL помилка: ' . $e->getMessage()]);
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
    $product_id = intval($data['product_id'] ?? 0);
    $name = trim($data['name'] ?? '');
    $img = trim($data['img'] ?? '');
    $price = trim($data['price'] ?? '');

    if ($product_id <= 0 || empty($name)) {
        echo json_encode(['success' => false, 'message' => 'Необхідний numeric product_id та name']);
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
    $product_id = intval($data['product_id'] ?? 0);

    if ($product_id <= 0) {
        echo json_encode(['success' => false, 'message' => 'numeric product_id обов\'язковий']);
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

        // Ensure UTF-8 so non-Latin text renders correctly
        $mail->CharSet = 'UTF-8';

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
// JOIN CLUB - save application (public)
// =========================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'join_club') {
    // Log incoming payload for debugging
    error_log('join_club payload: ' . json_encode($input));

    // Resilient reading: prefer $data, fallback to $input
    $name = trim($data['name'] ?? $input['name'] ?? '');
    $email = trim($data['email'] ?? $input['email'] ?? '');
    $phone = trim($data['phone'] ?? $input['phone'] ?? '');
    $message = trim($data['message'] ?? $input['message'] ?? '');

    // Write debug info to file for easy inspection
    $debugPath = __DIR__ . DIRECTORY_SEPARATOR . 'club_debug.log';
    $debugEntry = [
        'at' => date('c'),
        'payload' => $input,
        'processed' => ['name'=>$name,'email'=>$email,'phone'=>$phone]
    ];
    @file_put_contents($debugPath, json_encode($debugEntry, JSON_UNESCAPED_UNICODE) . PHP_EOL, FILE_APPEND | LOCK_EX);

    if (empty($name) || empty($email) || empty($phone) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $err = 'join_club validation failed: ' . json_encode(['name'=>$name,'email'=>$email,'phone'=>$phone]);
        error_log($err);
        @file_put_contents($debugPath, json_encode(['at'=>date('c'),'error'=>$err]) . PHP_EOL, FILE_APPEND | LOCK_EX);
        echo json_encode(['success' => false, 'message' => 'Невірні дані']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO club_applications (name, email, phone, message, status) VALUES (?, ?, ?, ?, 'pending')");
        $stmt->execute([$name, $email, $phone, $experience, $message]);

        $insertId = (int)$pdo->lastInsertId();
        $affected = $stmt->rowCount();

        // Log results
        $okEntry = ['at'=>date('c'),'insertId'=>$insertId,'affected'=>$affected];
        @file_put_contents($debugPath, json_encode($okEntry) . PHP_EOL, FILE_APPEND | LOCK_EX);
        error_log('join_club inserted id: ' . $insertId . ' affected: ' . $affected);

        if ($insertId <= 0 && $affected <= 0) {
            $warn = 'join_club insert affected 0 rows';
            error_log($warn);
            @file_put_contents($debugPath, json_encode(['at'=>date('c'),'warning'=>$warn]) . PHP_EOL, FILE_APPEND | LOCK_EX);
            echo json_encode(['success' => false, 'message' => 'Не вдалося зберегти заявку']);
            exit;
        }

        echo json_encode(['success' => true, 'message' => 'Заявку збережено', 'id' => $insertId]);
    } catch (PDOException $e) {
        $em = 'join_club SQL error: ' . $e->getMessage();
        error_log($em);
        @file_put_contents($debugPath, json_encode(['at'=>date('c'),'error'=>$em]) . PHP_EOL, FILE_APPEND | LOCK_EX);
        echo json_encode(['success' => false, 'message' => 'SQL помилка: ' . $e->getMessage()]);
    }
    exit;
}

// =========================================================
// GET CLUB APPLICATIONS (GET/POST) - admin only
// =========================================================
if (($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'GET') && ($action === 'get_club_applications' || (isset($input['action']) && $input['action'] === 'get_club_applications'))) {
    // Admin check
    $isAdmin = false;
    if (isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin') {
        $isAdmin = true;
    } else if (isset($_SESSION['user_id'])) {
        try {
            $rstmt = $pdo->prepare("SELECT role FROM users WHERE id = ? LIMIT 1");
            $rstmt->execute([$_SESSION['user_id']]);
            $r = $rstmt->fetch();
            if ($r && isset($r['role']) && $r['role'] === 'admin') {
                $isAdmin = true;
                $_SESSION['user_role'] = 'admin';
            }
        } catch (PDOException $e) {
            // ignore
        }
    }

    if (!$isAdmin) {
        echo json_encode(['success' => false, 'message' => 'Недостатньо прав']);
        exit;
    }

    try {
        // Accept optional status filter, default to pending
        $status = isset($data['status']) ? $data['status'] : 'pending';
        $allowed = ['pending','approved','rejected'];
        if (!in_array($status, $allowed)) $status = 'pending';

        $stmt = $pdo->prepare("SELECT id, name, email, phone, experience, message, status, created_at FROM club_applications WHERE status = ? ORDER BY created_at DESC");
        $stmt->execute([$status]);
        $rows = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $rows]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'SQL помилка: ' . $e->getMessage()]);
    }
    exit;
}

// =========================================================
// PROCESS CLUB APPLICATION (POST) - admin only: approve or reject
// =========================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'process_club_application') {
    // Admin check (same as above)
    $isAdmin = false;
    if (isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin') {
        $isAdmin = true;
    } else if (isset($_SESSION['user_id'])) {
        try {
            $rstmt = $pdo->prepare("SELECT role FROM users WHERE id = ? LIMIT 1");
            $rstmt->execute([$_SESSION['user_id']]);
            $r = $rstmt->fetch();
            if ($r && isset($r['role']) && $r['role'] === 'admin') {
                $isAdmin = true;
                $_SESSION['user_role'] = 'admin';
            }
        } catch (PDOException $e) {
            // ignore
        }
    }

    if (!$isAdmin) {
        echo json_encode(['success' => false, 'message' => 'Недостатньо прав']);
        exit;
    }

    $id = intval($data['id'] ?? 0);
    $status = $data['status'] ?? '';

    if ($id <= 0 || !in_array($status, ['approved','rejected'])) {
        echo json_encode(['success' => false, 'message' => 'Невірні параметри']);
        exit;
    }

    try {
        $userUpgraded = false;
        $stmt = $pdo->prepare("UPDATE club_applications SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);

        if ($status === 'approved') {
            $userStmt = $pdo->prepare("SELECT name, email FROM club_applications WHERE id = ? LIMIT 1");
            $userStmt->execute([$id]);
            $user = $userStmt->fetch();

            if ($user && filter_var($user['email'], FILTER_VALIDATE_EMAIL)) {
                $mail = new PHPMailer(true);
                try {
                    $mail->isSMTP();
                    $mail->Host       = 'smtp.gmail.com';
                    $mail->SMTPAuth   = true;
                    $mail->Username   = 'd33308645@gmail.com';
                    $mail->Password   = 'csevjuaxhcndyngt';
                    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
                    $mail->Port       = 465;
                    $mail->SMTPOptions = array('ssl' => array('verify_peer' => false, 'verify_peer_name' => false, 'allow_self_signed' => true));

                    // Ensure UTF-8 encoding for the message
                    $mail->CharSet = 'UTF-8';

                    $mail->setFrom('d33308645@gmail.com', 'Dionysus Private Club');
                    $mail->addAddress($user['email']);

                    $mail->isHTML(true);
                    $mail->Subject = "Заявку схвалено: Ласкаво просимо до Dionysus Club!";
                    $mail->Body    = "<h2>Вітаємо, " . htmlspecialchars($user['name']) . "!</h2><p>Ваша заявка на вступ до приватного клубу <strong>Dionysus Cellar</strong> була схвалена адміністратором.</p><p>Тепер ви маєте доступ до ексклюзивних вин та подій.</p><br><p>З повагою,<br>Команда Dionysus</p>";

                    $mail->send();
                } catch (Exception $e) {
                    error_log('Club approval email failed: ' . $mail->ErrorInfo . ' ' . $e->getMessage());
                }

                // If a registered user exists with that email — mark as club member
                try {
                    $checkUser = $pdo->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
                    $checkUser->execute([$user['email']]);
                    $found = $checkUser->fetch();
                    if ($found && isset($found['id'])) {
                        $upd = $pdo->prepare("UPDATE users SET is_club_member = 1 WHERE id = ?");
                        $upd->execute([$found['id']]);
                        $userUpgraded = true;
                    }
                } catch (PDOException $ue) {
                    error_log('Failed to update is_club_member: ' . $ue->getMessage());
                }
            }
        }

        // Return whether a registered user was upgraded to club member in the operation (if applicable)
        $resp = ['success' => true];
        if (isset($userUpgraded) && $userUpgraded) $resp['upgraded_user'] = true;
        echo json_encode($resp);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'SQL помилка: ' . $e->getMessage()]);
    }
    exit;
}

// =========================================================
// CREATE ORDER (POST) - ?action=create_order
// =========================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'create_order') {
    $product_name = trim($data['product_name'] ?? '');
    $quantity = intval($data['quantity'] ?? 1);
    $customer_name = trim($data['customer_name'] ?? '');
    $email = trim($data['email'] ?? '');
    $phone = trim($data['phone'] ?? '');

    // Debug: log incoming payload for investigation (will appear in PHP error log)
    error_log('create_order payload: ' . json_encode($data));

    if (empty($product_name) || empty($customer_name) || empty($email) || empty($phone) || $quantity < 1) {
        echo json_encode(['success' => false, 'message' => 'Невірні дані для замовлення']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Невірний email']);
        exit;
    }

    $user_id = $_SESSION['user_id'] ?? null;

    try {
        $stmt = $pdo->prepare("INSERT INTO orders (user_id, product_name, quantity, customer_name, email, phone, status) VALUES (?, ?, ?, ?, ?, ?, 'new')");
        $stmt->execute([$user_id, $product_name, $quantity, $customer_name, $email, $phone]);
        $orderId = $pdo->lastInsertId();

        // Debug: log inserted id
        error_log('create_order inserted id: ' . $orderId);

        echo json_encode(['success' => true, 'order_id' => $orderId, 'message' => 'Замовлення створено']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'SQL помилка: ' . $e->getMessage()]);
    }
    exit;
}

// =========================================================
// GET ORDERS (GET) - ?action=get_orders
// =========================================================
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'get_orders') {
    // Admin: return all orders. Logged user: return own orders. Guests -> error
    if (isset($_SESSION['user_id'])) {
        $isAdmin = false;
        // check role in session or db
        if (isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin') {
            $isAdmin = true;
        } else {
            // try to read role from DB
            try {
                $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ? LIMIT 1");
                $stmt->execute([$_SESSION['user_id']]);
                $r = $stmt->fetch();
                if ($r && isset($r['role']) && $r['role'] === 'admin') $isAdmin = true;
            } catch (PDOException $e) {
                // ignore
            }
        }

        try {
            if ($isAdmin) {
                $stmt = $pdo->prepare("SELECT o.id, o.user_id, u.name AS user_name, o.product_name, o.quantity, o.customer_name, o.email, o.phone, o.status, o.created_at FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC");
                $stmt->execute();
                $orders = $stmt->fetchAll();
            } else {
                $stmt = $pdo->prepare("SELECT id, user_id, product_name, quantity, customer_name, email, phone, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC");
                $stmt->execute([$_SESSION['user_id']]);
                $orders = $stmt->fetchAll();
            }

            echo json_encode(['success' => true, 'orders' => $orders]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'SQL помилка: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'not_logged_in', 'message' => 'Будь ласка, увійдіть щоб переглянути замовлення']);
    }
    exit;
}

// =========================================================
// GET PRODUCTS (GET) - ?action=get_products
// =========================================================
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'get_products') {
    try {
        $stmt = $pdo->prepare("SELECT id, name, price, image, category, description, created_at FROM products ORDER BY id DESC");
        $stmt->execute();
        $products = $stmt->fetchAll();
        echo json_encode(['success' => true, 'products' => $products]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'SQL помилка: ' . $e->getMessage()]);
    }
    exit;
}

// =========================================================
// UPDATE PRODUCT (POST) - ?action=update_product
// Requires admin session (only admin can update products)
// Accepts JSON: { id, name?: string, price?: string|number, category?: string, description?: string, image?: string }
// Returns updated product on success
// =========================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'update_product') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'not_logged_in', 'message' => 'Будь ласка, увійдіть щоб оновити продукт']);
        exit;
    }

    // Ensure user is admin
    $isAdmin = false;
    if (isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin') {
        $isAdmin = true;
    } else {
        try {
            $roleStmt = $pdo->prepare('SELECT role FROM users WHERE id = ? LIMIT 1');
            $roleStmt->execute([$_SESSION['user_id']]);
            $rr = $roleStmt->fetch();
            if ($rr && isset($rr['role']) && $rr['role'] === 'admin') {
                $isAdmin = true;
                $_SESSION['user_role'] = 'admin';
            }
        } catch (PDOException $e) {
            // ignore and fall through
        }
    }

    if (!$isAdmin) {
        echo json_encode(['success' => false, 'message' => 'Недостатньо прав']);
        exit;
    }

    $id = isset($data['id']) ? intval($data['id']) : 0;
    if ($id <= 0) {
        echo json_encode(['success' => false, 'message' => 'Невалідний id']);
        exit;
    }

    $name = array_key_exists('name', $data) ? trim($data['name']) : null;
    $price = array_key_exists('price', $data) ? trim((string)$data['price']) : null;
    $category = array_key_exists('category', $data) ? trim($data['category']) : null;
    $description = array_key_exists('description', $data) ? trim($data['description']) : null;
    $image = array_key_exists('image', $data) ? trim($data['image']) : null;

    $fields = [];
    $params = [];

    if ($name !== null && $name !== '') { $fields[] = 'name = ?'; $params[] = $name; }
    if ($price !== null && $price !== '') {
        // normalize price to decimal string
        $norm = str_replace(',', '.', preg_replace('/[^0-9\,\.]/', '', $price));
        $norm = number_format((float)$norm, 2, '.', '');
        $fields[] = 'price = ?'; $params[] = $norm;
    }
    if ($category !== null) { $fields[] = 'category = ?'; $params[] = $category; }
    if ($description !== null) { $fields[] = 'description = ?'; $params[] = $description; }
    if ($image !== null) { $fields[] = 'image = ?'; $params[] = $image; }

    if (empty($fields)) {
        echo json_encode(['success' => false, 'message' => 'Немає даних для оновлення']);
        exit;
    }

    try {
        $params[] = $id;
        $sql = 'UPDATE products SET ' . implode(', ', $fields) . ' WHERE id = ?';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $stmt = $pdo->prepare('SELECT id, name, price, image, category, description, created_at FROM products WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $prod = $stmt->fetch();

        echo json_encode(['success' => true, 'product' => $prod, 'message' => 'Продукт оновлено']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'SQL помилка: ' . $e->getMessage()]);
    }
    exit;
}

// =========================================================
// DELETE PRODUCT (POST) - ?action=delete_product
// =========================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'delete_product') {
    $id = isset($data['id']) ? intval($data['id']) : 0;

    if ($id <= 0) {
        echo json_encode(['success' => false, 'message' => 'Невалідний id']);
        exit;
    }

    try {
        // Optionally remove related favorites (if desired)
        $delFav = $pdo->prepare("DELETE FROM favorites WHERE product_id = ?");
        $delFav->execute([$id]);

        $del = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $del->execute([$id]);

        if ($del->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Продукт видалено']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Продукт не знайдено']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'SQL помилка: ' . $e->getMessage()]);
    }
    exit;
}

// =========================================================
// 5. ПЕРЕВІРКА СЕСІЇ
// =========================================================
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'check_session') {
    if (isset($_SESSION['user_id'])) {
        // Try to get role from session; if not present, fetch from DB
        $role = $_SESSION['user_role'] ?? null;
        if (!$role) {
            try {
                $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ? LIMIT 1");
                $stmt->execute([$_SESSION['user_id']]);
                $r = $stmt->fetch();
                if ($r && isset($r['role'])) {
                    $role = $r['role'];
                    // Cache role in session for subsequent requests
                    $_SESSION['user_role'] = $role;
                } else {
                    $role = 'user';
                }
            } catch (\PDOException $e) {
                $role = 'user';
            }
        }

        // Fetch fresh user data (including phone) when available
        try {
            $stmt = $pdo->prepare("SELECT id, name, email, phone, role, is_club_member FROM users WHERE id = ? LIMIT 1");
            $stmt->execute([$_SESSION['user_id']]);
            $u = $stmt->fetch();
            if ($u) {
                // Update cached session values
                $_SESSION['user_name'] = $u['name'];
                $_SESSION['user_email'] = $u['email'];
                $_SESSION['is_club_member'] = (int)($u['is_club_member'] ?? 0);
            }
        } catch (\PDOException $e) {
            // ignore, fall back to session values
            $u = null;
        }

        echo json_encode([
            'status' => 'success',
            'role' => $role,
            'user_name' => $_SESSION['user_name'],
            'logged_in' => true,
            'is_club_member' => (int)($_SESSION['is_club_member'] ?? 0),
            'user' => [
                'id' => $_SESSION['user_id'],
                'name' => $u['name'] ?? $_SESSION['user_name'],
                'email' => $u['email'] ?? ($_SESSION['user_email'] ?? ''),
                'phone' => $u['phone'] ?? null,
                'role' => $role,
                'is_club_member' => (int)($_SESSION['is_club_member'] ?? 0)
            ]
        ]);
    } else {
        echo json_encode(['status' => 'guest', 'logged_in' => false]);
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

// DB health check endpoint
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'health') {
    try {
        // Simple queries to verify DB connectivity
        $versionStmt = $pdo->query('SELECT VERSION() as v');
        $dbVersion = $versionStmt->fetchColumn();

        $countStmt = $pdo->query('SELECT COUNT(*) FROM products');
        $productCount = (int)$countStmt->fetchColumn();

        echo json_encode([
            'success' => true,
            'db_version' => $dbVersion,
            'product_count' => $productCount
        ]);
    } catch (\PDOException $e) {
        // Return structured JSON error so frontend can display it
        echo json_encode(['success' => false, 'message' => 'DB error: ' . $e->getMessage()]);
    }
    exit;
}

// Якщо не знайдено відповідного action, повертаємо дружню помилку у форматі JSON
echo json_encode(['success' => false, 'message' => 'Unknown action or missing action', 'action' => $action ?? null]);
exit;
?>