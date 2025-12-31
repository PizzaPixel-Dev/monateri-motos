(() => {
const SUPABASE_URL = "https://tnbfqakvotmgqbrjhmus.supabase.co";
const SUPABASE_KEY = "sb_publishable_Db5fiANKUMFWJIA3AhH5bQ_PgXZylG6";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

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

const motosTrack = document.getElementById("motosTrack");

function createMotoCard(moto) {
    return `
        <article class="moto-card">
        <div class="moto-img">
            <img src="${moto.image}" alt="${moto.brand} ${moto.model}">
        </div>

        <div class="moto-info">
            <h3>${moto.brand} ${moto.model}</h3>
            ${moto.year ? `<p class="moto-year">${moto.year}</p>` : ""}
            ${moto.motor ? `<p class="moto-motor">${moto.motor} cc.</p>` : ""}
            <p class="moto-price">$${moto.price.toLocaleString()}</p>
        </div>
        </article>
        `;
}


async function renderMotos() {
    const motos = await getMotos();

    motosTrack.innerHTML = motos
        .map(moto => createMotoCard(moto))
        .join("");
    console.log(motos);
    console.log(motosTrack);

}

renderMotos();


})();