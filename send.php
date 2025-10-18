<?php
// Clave secreta de tu reCAPTCHA
$secretKey = "TU_SECRET_KEY"; // poné aquí tu secret key

// Respuesta del captcha
$recaptchaResponse = $_POST['g-recaptcha-response'];

// Verificar con Google
$verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
$data = [
    'secret' => $secretKey,
    'response' => $recaptchaResponse
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

// Validación del captcha
if ($result["success"] == true) {
    $name = htmlspecialchars($_POST["name"]);
    $email = htmlspecialchars($_POST["email"]);
    $message = htmlspecialchars($_POST["message"]);

    // Configuración del correo
    $to = "tu_correo@ejemplo.com"; // tu correo de destino
    $subject = "Nuevo mensaje desde Vizcaino Abogados";
    $body = "Nombre: $name\nCorreo: $email\n\nMensaje:\n$message";
    $headers = "From: $email\r\nReply-To: $email\r\n";

    if (mail($to, $subject, $body, $headers)) {
        echo "Mensaje enviado correctamente.";
    } else {
        echo "Hubo un error al enviar el mensaje.";
    }
} else {
    echo "Captcha inválido. Por favor intenta de nuevo.";
}
?>
