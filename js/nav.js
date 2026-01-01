(() => {
const body = document.body;
const links = document.querySelectorAll('.nav-header a');
const nav = document.querySelector('.nav-header');
const navBtn = document.querySelector('.btn-hamburger');

navBtn.addEventListener("click", toggleNav);
links.forEach(link => {
    link.addEventListener("click", closeNav);
});

function toggleNav() {
    nav.classList.toggle("active");
    navBtn.classList.toggle("open");
    body.classList.toggle("no-scroll");
};

function closeNav() {
    nav.classList.remove("active");
    navBtn.classList.remove("open");
    body.classList.remove("no-scroll");
};
})();