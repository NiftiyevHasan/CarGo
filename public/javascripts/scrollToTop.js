
var scrollToTopBtn = document.querySelector(".scrollToTopBtn")
var rootElement = document.documentElement

window.onload = function () {
    scrollToTopBtn.addEventListener('click', () => {
        rootElement.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    });

}

