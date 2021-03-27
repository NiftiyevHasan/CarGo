
var scrollToTopBtn = document.querySelector(".scrollToTopBtn")
var rootElement = document.documentElement

window.onload = function () {
    if(this.document.location.pathname == '/cargopanel'){
        scrollToTopBtn.classList.remove('invisible')
    }
    scrollToTopBtn.addEventListener('click', () => {
        rootElement.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    });

}

