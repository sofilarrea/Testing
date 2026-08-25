// Esperamos a que todo el HTML esté cargado antes de ejecutar la magia
document.addEventListener("DOMContentLoaded", () => {

  // Seleccionamos todos los enlaces
  const enlaces = document.querySelectorAll(".ver-mas-enlace");

  enlaces.forEach(enlace => {
    enlace.addEventListener("click", function(event) {
      event.preventDefault(); // Evita que la página salte hacia arriba

      // Encuentra el contenedor de la tarjeta más cercano
      const card = this.closest('.card');

      // Encuentra el elemento .contenido-extra dentro de ESA tarjeta
      const contenidoExtra = card.querySelector(".contenido-extra");

      // SEGURO ANTI-CRASH: Si la tarjeta no tiene contenido extra, frenamos acá.
      if (!contenidoExtra) {
        console.warn("Esta tarjeta no tiene un div con la clase .contenido-extra");
        return;
      }

      // Alternar entre mostrar y ocultar el contenido
      if (contenidoExtra.classList.contains("oculto")) {
        contenidoExtra.classList.remove("oculto");
        contenidoExtra.classList.add("mostrar");
        this.textContent = "Ver Menos";
      } else {
        contenidoExtra.classList.remove("mostrar");
        contenidoExtra.classList.add("oculto");
        this.textContent = "Ver Más";
      }
    });
  });

});

const carousel = document.querySelector('.carousel');
const items = Array.from(document.querySelectorAll('.carousel-item'));
const pixelsPerStep = 1; // Cantidad de píxeles a mover en cada paso
const intervalTime = 10; // Tiempo entre cada desplazamiento

// Duplica los elementos para simular un carrusel infinito
items.forEach(item => {
  const clone = item.cloneNode(true);
  carousel.appendChild(clone);
});

let scrollAmount = 0;

function autoScroll() {
  scrollAmount -= pixelsPerStep;

  // Actualiza el transform para mover el carrusel
  carousel.style.transform = `translateX(${scrollAmount}px)`;

  // Reinicia el scroll cuando llega al final
  const totalWidth = items.length * items[0].offsetWidth; // Ancho total de los ítems originales
  if (Math.abs(scrollAmount) >= totalWidth) {
    scrollAmount = 0;
  }
}

// Inicia el desplazamiento automático
setInterval(autoScroll, intervalTime);


function sendMail() {

  let parms = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value,

  }
  emailjs.send("service_59kqwnd", "template_6xy4dkt",parms).then(alert("Email Enviado"))
}

const parallaxBg = document.querySelector('.parallax-bg');
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

if (!isIOS) {
  window.addEventListener('scroll', () => {
    const offset = window.pageYOffset;
    parallaxBg.style.transform = `translateY(${offset * 0.4}px)`;
  });
}
