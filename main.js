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
