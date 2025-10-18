<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Clave secreta reCAPTCHA
$secretKey = "6LeJRu4rAAAAAMr7ZI3gXxBRyg8BvWqO2fpdTgJz";
$recaptchaResponse = $_POST['g-recaptcha-response'] ?? '';

// Verificar captcha
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

// Validar captcha
if (!empty($result["success"]) && $result["success"] === true) {
    $name = htmlspecialchars($_POST["name"]);
    $email = htmlspecialchars($_POST["email"]);
    $message = htmlspecialchars($_POST["message"]);

    $mail = new PHPMailer(true);

    try {
        // Configuración SMTP (ejemplo con Gmail)
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'TUCUENTA@gmail.com'; // tu Gmail
        $mail->Password   = 'APP_PASSWORD';       // clave de aplicación
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;

        // Remitente
        $mail->setFrom('TUCUENTA@gmail.com', 'Formulario Web');
        // Destinatario (tu correo personal)
        $mail->addAddress('sofialejandra.larrea@gmail.com');

        // Contenido
        $mail->isHTML(true);
        $mail->Subject = "Nuevo mensaje desde Vizcaino Abogados";
        $mail->Body    = "<b>Nombre:</b> $name <br><b>Email:</b> $email <br><b>Mensaje:</b><br>$message";

        $mail->send();
        echo "<div style='padding:20px; background:#dff0d8; color:#3c763d; border-radius:5px;'>
                ✅ ¡Mensaje enviado correctamente! Gracias por contactarnos.
              </div>";
    } catch (Exception $e) {
        echo "<div style='padding:20px; background:#f2dede; color:#a94442; border-radius:5px;'>
                ❌ Error al enviar: {$mail->ErrorInfo}
              </div>";
    }
} else {
    echo "<div style='padding:20px; background:#f2dede; color:#a94442; border-radius:5px;'>
            ⚠️ Captcha inválido. Intenta de nuevo.
          </div>";
}
