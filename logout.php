<?php
// logout.php - unified logout page for users and admins
// Ensure session cookies are configured exactly as other API endpoints
session_set_cookie_params([
    "lifetime" => 0,
    "path" => "/",
    "secure" => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    "httponly" => true,
    "samesite" => "Lax"
]);

// Start session if not started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Clear session data
$_SESSION = [];
session_unset();

// If using cookies, remove session cookie
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params['path'], $params['domain'] ?? '', $params['secure'] ?? false, $params['httponly'] ?? false
    );
}

// Finally destroy the session
session_destroy();

// Redirect back to homepage
header('Location: index.html');
exit;
?>