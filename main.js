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