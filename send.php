<?php
// verify.php
header('Content-Type: application/json');

$secretKey = "6LeJRu4rAAAAAMr7ZI3gXxBRyg8BvWqO2fpdTgJz"; // TU secret key
$token = $_POST['token'] ?? '';
$remote = $_SERVER['REMOTE_ADDR'] ?? '';

if (!$token) {
  echo json_encode(['ok' => false, 'reason' => 'missing-token']);
  exit;
}

$verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
$data = [
  'secret' => $secretKey,
  'response' => $token,
  'remoteip' => $remote
];

$options = [
  'http' => [
    'method' => 'POST',
    'header' => "Content-type: application/x-www-form-urlencoded\r\n",
    'content' => http_build_query($data),
    'timeout' => 8
  ]
];

$context = stream_context_create($options);
$response = file_get_contents($verifyUrl, false, $context);
$result = json_decode($response, true);

// Éxito si success=true
$ok = !empty($result['success']);
echo json_encode(['ok' => $ok, 'google' => $result]);
