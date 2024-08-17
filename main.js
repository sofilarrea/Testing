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
