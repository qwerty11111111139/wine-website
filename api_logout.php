<?php
// api_logout.php - server-side logout for admin panel
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params(["lifetime" => 0, "path" => "/", "secure" => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off', "httponly" => true, "samesite" => "Lax"]);
    session_start();
}

// Full logout: clear session array and remove session cookie
$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params['path'], $params['domain'], $params['secure'], $params['httponly']
    );
}
session_unset();
session_destroy();

echo json_encode(['success' => true]);
