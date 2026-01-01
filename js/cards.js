(() => {
const SUPABASE_URL = "https://tnbfqakvotmgqbrjhmus.supabase.co";
const SUPABASE_KEY = "sb_publishable_Db5fiANKUMFWJIA3AhH5bQ_PgXZylG6";
const motosTrack = document.getElementById("motosTrack");
const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");
let currentIndex = 0;

async function getMotos() {
    const { data, error } = await supabase
    .from("motos")
    .select("*")
    .eq("active", true)
    .order("id", { ascending: false });

    if (error) {
        console.error("Error cargando motos:", error);
        return [];
    }

    return data;
}

function createMotoCard(moto) {
    return `
        <article class="moto-card">
        <div class="moto-img">
            <img src="${moto.image}" alt="${moto.brand} ${moto.model}">
        </div>

        <div class="moto-info">
            <h6>${moto.brand}</h6>
            <h3>${moto.model}</h3>
            ${moto.year ? `<p class="moto-year">${moto.year}</p>` : ""}
            ${moto.motor ? `<p class="moto-motor">${moto.motor} cc.</p>` : ""}
            <p class="moto-price">$${moto.price.toLocaleString()}</p>
        </div>
        </article>
        `;
}

function getStep() {
    const width = window.innerWidth;

    if (width >= 900) return 3;
    if (width >= 600) return 2;
    return 1;
}

function updateCarousel() {
    const card = document.querySelector(".moto-card");
    if (!card) return;

    const cardWidth = card.offsetWidth + 24;
    const translateX = -(currentIndex * cardWidth);

    motosTrack.style.transform = `translateX(${translateX}px)`;
    updateArrows();
}

nextBtn.addEventListener("click", () => {
    const step = getStep();
    const totalCards = document.querySelectorAll(".moto-card").length;

    const maxIndex = totalCards - 1;

    currentIndex = Math.min(currentIndex + step, maxIndex);
    updateCarousel();
});

prevBtn.addEventListener("click", () => {
    const step = getStep();
    currentIndex = Math.max(currentIndex - step, 0);
    updateCarousel();
});

window.addEventListener("resize", () => {
    currentIndex = 0;
    updateCarousel();
});

async function renderMotos() {
    const motos = await getMotos();

    motosTrack.innerHTML = motos
        .map(moto => createMotoCard(moto))
        .join("");
    console.log(motos);
    console.log(motosTrack);

}

function updateArrows() {
    const totalCards = document.querySelectorAll(".moto-card").length;

    prevBtn.classList.toggle("hidden", currentIndex === 0);
    nextBtn.classList.toggle(
        "hidden",
        currentIndex >= totalCards - 1
    );
}


renderMotos().then(() => {
    updateArrows();});
})();