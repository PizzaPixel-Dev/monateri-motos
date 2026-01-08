export function initCatalog(supabase) {
	renderMotos(supabase).then(() => {
		document
			.querySelectorAll(".motos-carousel-wrapper")
			.forEach(initCarousel);

		initConsultarButtons();
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
				<div class="footer-card">
					<p class="moto-price">$${moto.price.toLocaleString()}</p>
					<button class="btn-consultar" data-moto="${moto.brand} ${moto.model}">
						Consultar
					</button>
				</div>
			</div>
		</article>
	`;
}

async function renderMotos(supabase) {
	const motos = await getMotos(supabase);

	const motosNew = motos.filter(moto => moto.new === true);
	const motosUsed = motos.filter(moto => moto.new === false);

	document.getElementById("motosTrack").innerHTML =
		motosNew.map(createMotoCard).join("");

	document.getElementById("motosTrackUsed").innerHTML =
		motosUsed.map(createMotoCard).join("");
}

function getStep() {
	const width = window.innerWidth;

	if (width >= 900) return 3;
	if (width >= 600) return 2;
	return 1;
}

function isTouchDevice() {
	return (
		"ontouchstart" in window ||
		navigator.maxTouchPoints > 0
	);
}

function initCarousel(wrapper) {
	const track = wrapper.querySelector(".motosTrack");
	const prevBtn = wrapper.querySelector(".carousel-btn.prev");
	const nextBtn = wrapper.querySelector(".carousel-btn.next");

	let currentIndex = 0;

	function updateButtons(cardsLength) {
		const hideForTouch =
			isTouchDevice() && window.innerWidth < 768;

		if (hideForTouch) {
			prevBtn.classList.add("hidden");
			nextBtn.classList.add("hidden");
			return;
		}

		prevBtn.classList.toggle("hidden", currentIndex === 0);
		nextBtn.classList.toggle(
			"hidden",
			currentIndex >= cardsLength - getStep()
		);
	}

	function update() {
		const cards = track.querySelectorAll(".moto-card");
		if (!cards.length) return;

		const cardWidth = cards[0].offsetWidth + 24;
		const translateX = -(currentIndex * cardWidth);

		track.style.transform = `translateX(${translateX}px)`;

		updateButtons(cards.length);
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

	initDrag({
		wrapper,
		track,
		getIndex: () => currentIndex,
		setIndex: value => currentIndex = value,
		update
	});

	window.addEventListener("resize", () => {
		currentIndex = 0;
		update();
	});

	update();
}

function initDrag({ wrapper, track, getIndex, setIndex, update }) {
	const EDGE_RESISTANCE = 0.3;

	let startX = 0;
	let currentTranslate = 0;
	let prevTranslate = 0;
	let isDragging = false;

	function setTranslate(x) {
		track.style.transform = `translateX(${x}px)`;
	}

	function getCardWidth() {
		const card = track.querySelector(".moto-card");
		return card ? card.offsetWidth + 24 : 0;
	}

	wrapper.addEventListener(
		"touchstart",
		e => {
			startX = e.touches[0].clientX;
			isDragging = true;
			track.style.transition = "none";
			prevTranslate = currentTranslate;
		},
		{ passive: true }
	);

	wrapper.addEventListener(
		"touchmove",
		e => {
			if (!isDragging) return;

			const currentX = e.touches[0].clientX;
			const delta = currentX - startX;
			const cardWidth = getCardWidth();
			const cards = track.children.length;

			const maxTranslate = 0;
			const minTranslate = -(cards - 1) * cardWidth;

			let nextTranslate = prevTranslate + delta;

			if (nextTranslate > maxTranslate) {
				nextTranslate =
					maxTranslate +
					(nextTranslate - maxTranslate) * EDGE_RESISTANCE;
			}

			if (nextTranslate < minTranslate) {
				nextTranslate =
					minTranslate +
					(nextTranslate - minTranslate) * EDGE_RESISTANCE;
			}

			currentTranslate = nextTranslate;
			setTranslate(currentTranslate);
		},
		{ passive: true }
	);

	wrapper.addEventListener("touchend", () => {
		if (!isDragging) return;

		isDragging = false;
		track.style.transition = "transform 0.4s ease";

		const cardWidth = getCardWidth();
		const movedBy = currentTranslate - prevTranslate;
		const movedCards = Math.round(Math.abs(movedBy) / cardWidth);

		let index = getIndex();

		if (movedCards > 0) {
			if (movedBy < 0) {
				index = Math.min(
					index + movedCards,
					track.children.length - 1
				);
			} else {
				index = Math.max(index - movedCards, 0);
			}
		}

		setIndex(index);
		update();
	});
}

function initConsultarButtons() {
	const buttons = document.querySelectorAll(".btn-consultar");
	const textarea = document.querySelector("#contact textarea");

	buttons.forEach(btn => {
		btn.addEventListener("click", () => {
			const moto = btn.dataset.moto;

			textarea.value =
				`¡Hola! 👋 Quisiera consultar por la disponibilidad y financiación de la ${moto}.   Muchas gracias.`;

			document
				.getElementById("contact")
				.scrollIntoView({ behavior: "smooth" });

			textarea.focus();
		});
	});
}
