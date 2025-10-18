<?php
// verify.php — valida reCAPTCHA y responde JSON

header('Content-Type: application/json');

// CORS: permitir desde tu dominio y desde localhost en desarrollo
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = [
  'https://vizcaino-abogados.com',
  'https://www.vizcaino-abogados.com',
  'http://localhost:5500',
  'http://localhost:5501',
  'http://localhost:5502',
  'http://localhost:8000'
];
if (in_array($origin, $allowed, true)) {
  header("Access-Control-Allow-Origin: $origin");
  header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Tu SECRET KEY de reCAPTCHA v2
$secretKey = "6LeJRu4rAAAAAMr7ZI3gXxBRyg8BvWqO2fpdTgJz";

$token  = $_POST['token'] ?? '';
$remote = $_SERVER['REMOTE_ADDR'] ?? '';

if (!$token) {
  echo json_encode(['ok' => false, 'reason' => 'missing-token']);
  exit;
}

$verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
$postData  = http_build_query([
  'secret'   => $secretKey,
  'response' => $token,
  'remoteip' => $remote
]);

// Usar cURL (más compatible que file_get_contents)
$ch = curl_init($verifyUrl);
curl_setopt_array($ch, [
  CURLOPT_POST           => true,
  CURLOPT_POSTFIELDS     => $postData,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_TIMEOUT        => 10,
  CURLOPT_HTTPHEADER     => ['Content-Type: application/x-www-form-urlencoded']
]);
$response = curl_exec($ch);
$curlErr  = curl_error($ch);
curl_close($ch);

if ($response === false) {
  echo json_encode(['ok' => false, 'reason' => 'curl-failed', 'error' => $curlErr]);
  exit;
}

$result = json_decode($response, true);
$ok = !empty($result['success']);

echo json_encode(['ok' => $ok, 'google' => $result]);
