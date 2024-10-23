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

// Mover el carrusel de manera continua
setInterval(autoScroll, intervalTime);
