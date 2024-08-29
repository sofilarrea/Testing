document.addEventListener("DOMContentLoaded", function() {
    const videos = document.querySelectorAll("video[data-src]");
    const options = {
        rootMargin: "0px",
        threshold: 0.1
    };

    const loadVideo = (video) => {
        video.src = video.getAttribute("data-src");
        video.removeAttribute("data-src");
    };

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadVideo(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        videos.forEach(video => {
            observer.observe(video);
        });
    } else {
        videos.forEach(video => {
            loadVideo(video);
        });
    }
});

const formulario = document.querySelector('#form')
formulario.addEventListener('submit', handleSubmit);
function handleSubmit(event){
  console.log("hello")
  event.preventDefault()
  const form = new FormData(this)
  console.log(form.get('name'))
}
// document.addEventListener('DOMContentLoaded', () => {
//   const formulario = document.querySelector('#form');
//   formulario.addEventListener('submit', handleSubmit);
// });

// function handleSubmit(event) {
//   event.preventDefault();
//   console.log("Form submission prevented");

//   const form = new FormData(event.target);
//   console.log("Name: ", form.get('name'));
//   console.log("Email: ", form.get('email'));
//   console.log("Message: ", form.get('message'));
// }
/* Accordeon */
document.addEventListener('DOMContentLoaded', () => {
  const headers = document.querySelectorAll('.accordion-header-ideario');

  headers.forEach(header => {
      header.addEventListener('click', function () {
          const section = this.parentElement;
          const content = section.querySelector('.accordion-content-ideario');

          // Verificar si la sección ya está activa
          const isActive = section.classList.contains('active');

          // Colapsar todas las secciones
          document.querySelectorAll('.accordion-section-ideario').forEach(sec => {
              const secContent = sec.querySelector('.accordion-content-ideario');
              if (secContent) {
                  secContent.style.maxHeight = '0'; // Colapsar todas las secciones
              }
              sec.classList.remove('active');
          });

          // Si la sección no estaba activa, expándela
          if (!isActive) {
              section.classList.add('active');
              content.style.maxHeight = content.scrollHeight + 'px'; // Expande el contenido
          }
      });
  });

  // Colapsar todas las secciones inicialmente
  document.querySelectorAll('.accordion-content-ideario').forEach(content => {
      content.style.maxHeight = '0'; // Colapsa todas las secciones al cargar la página
      content.style.overflow = 'hidden'; // Evitar que el contenido desborde
      content.style.transition = 'max-height 0.5s ease-in-out'; // Suave transición de colapsado/expandido
  });
});
