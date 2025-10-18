<?php
// Clave secreta reCAPTCHA
$secretKey = "6LeJRu4rAAAAAMr7ZI3gXxBRyg8BvWqO2fpdTgJz";
$recaptchaResponse = $_POST['g-recaptcha-response'] ?? '';

// Verificar captcha con Google
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

// Si el captcha es válido → mandar con EmailJS
if (!empty($result["success"]) && $result["success"] === true) {
    $name = htmlspecialchars($_POST["name"]);
    $email = htmlspecialchars($_POST["email"]);
    $message = htmlspecialchars($_POST["message"]);

    // Configuración EmailJS
    $emailjsData = [
        "service_id" => "service_yas1hvc",
        "template_id" => "template_6xy4dkt",
        "user_id" => "trB1-frfrQNxBOI-F", // tu Public Key
        "template_params" => [
            "name" => $name,
            "email" => $email,
            "message" => $message
        ]
    ];

    // Enviar a la API de EmailJS con cURL
    $ch = curl_init("https://api.emailjs.com/api/v1.0/email/send");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($emailjsData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $result = curl_exec($ch);
    $httpStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpStatus == 200) {
        echo "<div style='padding:20px; background:#dff0d8; color:#3c763d; border-radius:5px;'>
                ✅ ¡Mensaje enviado correctamente con EmailJS!
              </div>";
    } else {
        echo "<div style='padding:20px; background:#f2dede; color:#a94442; border-radius:5px;'>
                ❌ Error al enviar con EmailJS. Código: $httpStatus<br>Respuesta: $result
              </div>";
    }
} else {
    echo "<div style='padding:20px; background:#f2dede; color:#a94442; border-radius:5px;'>
            ⚠️ Captcha inválido. Por favor intenta de nuevo.
          </div>";
}
?>
