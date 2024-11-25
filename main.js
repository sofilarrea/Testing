document.querySelectorAll(".ver-mas-enlace").forEach(enlace => {
  enlace.addEventListener("click", function(event) {
    event.preventDefault(); // Evita que el enlace navegue

    // Encuentra el contenedor de la tarjeta más cercano
    const card = this.closest('.card');
    // Encuentra el siguiente elemento .contenido-extra dentro del contenedor de la tarjeta
    const contenidoExtra = card.querySelector(".contenido-extra");

    // Alternar entre mostrar y ocultar el contenido
    if (contenidoExtra.classList.contains("oculto")) {
      contenidoExtra.classList.remove("oculto");
      contenidoExtra.classList.add("mostrar");
      this.textContent = "Ver Menos"; // Cambia el texto del enlace
    } else {
      contenidoExtra.classList.remove("mostrar");
      contenidoExtra.classList.add("oculto");
      this.textContent = "Ver Más"; // Cambia el texto del enlace de nuevo
    }
  });
});

const carousel = document.querySelector('.carousel');
const items = Array.from(document.querySelectorAll('.carousel-item'));
const pixelsPerStep = 1; // Píxeles que se desplaza en cada paso
const intervalTime = 10; // Tiempo entre cada desplazamiento (en milisegundos)

// Clona los elementos del carrusel para crear un bucle infinito
items.forEach(item => {
  const clone = item.cloneNode(true);
  carousel.appendChild(clone);
});

let scrollAmount = 0;

function autoScroll() {
  scrollAmount -= pixelsPerStep;
  carousel.style.transform = `translateX(${scrollAmount}px)`;

  // Si se ha desplazado más allá del ancho original, reiniciar el desplazamiento
  if (Math.abs(scrollAmount) >= carousel.scrollWidth / 2) {
    scrollAmount = 0;
  }
}

/*
function sendMail() {

  let parms = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value,

  }
  emailjs.send("service_59kqwnd", "template_6xy4dkt",parms).then(alert("Email Enviado"))
}
 */
function sendMail(event) {
  event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario (recarga de la página)

  // Obtener la respuesta del reCAPTCHA
  const recaptchaResponse = grecaptcha.getResponse();

  if (recaptchaResponse.length === 0) {
      // Mostrar mensaje si no se ha completado el reCAPTCHA
      alert("Por favor, completa el reCAPTCHA antes de enviar el formulario.");
      return; // Detener la ejecución si el reCAPTCHA no está completado
  }

  // Recoger los valores del formulario manualmente
  let parms = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value,
      "g-recaptcha-response": recaptchaResponse // Añadir la respuesta del reCAPTCHA
  };

  // Enviar el correo utilizando EmailJS
  emailjs.send("service_59kqwnd", "template_6xy4dkt", parms)
      .then(function(response) {
          // Manejar el éxito del envío
          alert("Correo enviado correctamente.");
          console.log("SUCCESS!", response.status, response.text);
          document.getElementById("form").reset(); // Limpiar el formulario después de enviar el correo
          grecaptcha.reset(); // Resetear el reCAPTCHA después de enviarlo
      })
      .catch(function(error) {
          // Manejar el error del envío
          alert("Ocurrió un error al enviar el correo. Por favor, intenta nuevamente.");
          console.error("FAILED...", error);
      });
}
