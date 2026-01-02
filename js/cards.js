export function initCatalog(supabase) {
    renderMotos(supabase).then(() => {
    document
        .querySelectorAll(".motos-carousel-wrapper")
        .forEach(initCarousel);
});
}

async function getMotos(supabase) {
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

async function renderMotos(supabase) {
    const motos = await getMotos(supabase);
    const motosNew = motos.filter(moto => moto.new === true);
    const motosUsed = motos.filter(moto => moto.new === false);

    const trackNew = document.getElementById("motosTrack");
    const trackUsed = document.getElementById("motosTrackUsed");

    trackNew.innerHTML = motosNew
        .map(createMotoCard)
        .join("");

    trackUsed.innerHTML = motosUsed
        .map(createMotoCard)
        .join("");

}

function getStep() {
    const width = window.innerWidth;

    if (width >= 900) return 3;
    if (width >= 600) return 2;
    return 1;
}

function initCarousel(wrapper) {
    const track = wrapper.querySelector(".motosTrack");
    const prevBtn = wrapper.querySelector(".carousel-btn.prev");
    const nextBtn = wrapper.querySelector(".carousel-btn.next");

    let currentIndex = 0;

    function update() {
        const cards = track.querySelectorAll(".moto-card");

        if (cards.length <= 1) {
            prevBtn.classList.add("hidden");
            nextBtn.classList.add("hidden");
            return;
        }

        const cardWidth = cards[0].offsetWidth + 24;

        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

        prevBtn.classList.toggle("hidden", currentIndex === 0);
        nextBtn.classList.toggle(
            "hidden",
            currentIndex >= cards.length - 1
        );
    }

    nextBtn.addEventListener("click", () => {
        currentIndex = Math.min(
            currentIndex + getStep(),
            track.children.length - 1
        );
        update();
    });

    prevBtn.addEventListener("click", () => {
        currentIndex = Math.max(currentIndex - getStep(), 0);
        update();
    });

    window.addEventListener("resize", () => {
        currentIndex = 0;
        update();
    });

    update();
}
