export function initNav() {
    const body = document.body;
    const links = document.querySelectorAll('.nav-header a');
    const nav = document.querySelector('.nav-header');
    const navBtn = document.querySelector('.btn-hamburger');
    const header = document.querySelector(".header");
    const sections = document.querySelectorAll('section');

    if (!header || !nav || !navBtn) return;

    const headerHeight = header.offsetHeight;

    function handleHeaderScroll() {
    header.classList.toggle("scrolled", window.scrollY > 50);
    }

    function applyScrollMargin() {
        sections.forEach(sec => {
        sec.style.scrollMarginTop = `${headerHeight}px`;
        });
    }

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

    applyScrollMargin();
    handleHeaderScroll();
    navBtn.addEventListener("click", toggleNav);
    links.forEach(link => link.addEventListener("click", closeNav));
    window.addEventListener("scroll", handleHeaderScroll);
    
}