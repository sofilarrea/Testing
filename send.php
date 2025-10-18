<?php
$secretKey = "6LeJRu4rAAAAAMr7ZI3gXxBRyg8BvWqO2fpdTgJz";
$recaptchaResponse = $_POST['g-recaptcha-response'] ?? '';

$verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
$data = [
    'secret' => $secretKey,
    'response' => $recaptchaResponse,
    'remoteip' => $_SERVER['REMOTE_ADDR']
];

$options = [
    'http' => [
        'method' => 'POST',
        'header' => "Content-type: application/x-www-form-urlencoded\r\n",
        'content' => http_build_query($data)
    ]
];
$context = stream_context_create($options);
$response = file_get_contents($verifyUrl, false, $context);
$result = json_decode($response, true);

if (!empty($result["success"]) && $result["success"] === true) {
    $name = htmlspecialchars($_POST["name"]);
    $email = htmlspecialchars($_POST["email"]);
    $message = htmlspecialchars($_POST["message"]);

    $to = "tu_correo@ejemplo.com"; // tu correo de destino real
    $subject = "Nuevo mensaje desde Vizcaino Abogados";
    $body = "Nombre: $name\nCorreo: $email\n\nMensaje:\n$message";
    $headers = "From: $email\r\nReply-To: $email\r\n";

    if (mail($to, $subject, $body, $headers)) {
        echo "<div style='padding:20px; background:#dff0d8; color:#3c763d; border-radius:5px;'>
                ✅ ¡Mensaje enviado correctamente! Gracias por contactarnos.
              </div>";
    } else {
        echo "<div style='padding:20px; background:#f2dede; color:#a94442; border-radius:5px;'>
                ❌ Hubo un error al enviar el mensaje. Intenta más tarde.
              </div>";
    }
} else {
    echo "<div style='padding:20px; background:#f2dede; color:#a94442; border-radius:5px;'>
            ⚠️ Captcha inválido. Por favor, intenta de nuevo.
          </div>";
}
?>
