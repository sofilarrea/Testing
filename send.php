<?php
// ✅ Tu clave secreta de reCAPTCHA
$secretKey = "6LeJRu4rAAAAAMr7ZI3gXxBRyg8BvWqO2fpdTgJz";

// Respuesta del captcha
$recaptchaResponse = $_POST['g-recaptcha-response'] ?? '';

// Verificar con Google
$verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
$data = [
    'secret' => $secretKey,
    'response' => $recaptchaResponse,
    'remoteip' => $_SERVER['REMOTE_ADDR'] // opcional
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

// 👇 DEBUG: mostramos la respuesta de Google
echo "<pre>";
print_r($result);
echo "</pre>";

// Si es válido, mandamos el correo
if (!empty($result["success"]) && $result["success"] === true) {
    $name = htmlspecialchars($_POST["name"]);
    $email = htmlspecialchars($_POST["email"]);
    $message = htmlspecialchars($_POST["message"]);

    $to = "tu_correo@ejemplo.com"; // cambia por tu correo real
    $subject = "Nuevo mensaje desde Vizcaino Abogados";
    $body = "Nombre: $name\nCorreo: $email\n\nMensaje:\n$message";
    $headers = "From: $email\r\nReply-To: $email\r\n";

    if (mail($to, $subject, $body, $headers)) {
        echo "Mensaje enviado correctamente.";
    } else {
        echo "Hubo un error al enviar el mensaje.";
    }
} else {
    echo "Captcha inválido.";
}
?>
