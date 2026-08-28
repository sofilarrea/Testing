/* =========================================
   1. CARRUSEL INFINITO
========================================= */
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


/* =========================================
   2. FORMULARIO DE CONTACTO (EMAILJS)
========================================= */
function sendMail() {
  let parms = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value,
  }
  emailjs.send("service_59kqwnd", "template_6xy4dkt", parms).then(alert("Email Enviado"))
}


/* =========================================
   3. EFECTO PARALLAX (FONDO)
========================================= */
const parallaxBg = document.querySelector('.parallax-bg');
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

if (!isIOS && parallaxBg) {
  window.addEventListener('scroll', () => {
    const offset = window.pageYOffset;
    parallaxBg.style.transform = `translateY(${offset * 0.4}px)`;
  });
}


/* =========================================
   4. TARJETAS INTERACTIVAS (ÁREAS DE PRÁCTICA)
========================================= */
document.addEventListener("DOMContentLoaded", () => {
  // Seleccionamos toda la tarjeta
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    card.addEventListener("click", function(event) {
      // Si el clic fue exactamente en el enlace "Ver Más", evitamos que la página salte
      if (event.target.classList.contains("ver-mas-enlace")) {
        event.preventDefault();
      }

      // Buscamos el contenido extra y el enlace DENTRO de la tarjeta clickeada
      const contenidoExtra = this.querySelector(".contenido-extra");
      const enlace = this.querySelector(".ver-mas-enlace");

      // Si no hay contenido extra, no hacemos nada
      if (!contenidoExtra) return;

      // Alternamos las clases para mostrar/ocultar y cambiamos el texto
      if (contenidoExtra.classList.contains("oculto")) {
        contenidoExtra.classList.remove("oculto");
        contenidoExtra.classList.add("mostrar");
        if (enlace) enlace.innerText = "Ver Menos";
      } else {
        contenidoExtra.classList.remove("mostrar");
        contenidoExtra.classList.add("oculto");
        if (enlace) enlace.innerText = "Ver Más";
      }
    });
  });
});
