const envelopeIntro = document.querySelector("#envelopeIntro");
const envelope = document.querySelector("#envelope");
const waxSeal = document.querySelector("#waxSeal");
const invitation = document.querySelector("#invitation");
const nav = document.querySelector(".floating-nav");
const audio = document.querySelector("#weddingAudio");
const musicButton = document.querySelector("#musicButton");
const musicLabel = musicButton.querySelector(".music-label");
const toast = document.querySelector("#toast");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let toastTimer;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function burstConfetti(count = 90) {
    if (reduceMotion) return;

    const container = document.querySelector("#confetti");
    const colors = ["#b88e4e", "#d9c4df", "#7b557e", "#f5d8cf", "#fff2c8", "#843f59"];

    for (let index = 0; index < count; index += 1) {
        const piece = document.createElement("i");
        piece.className = "confetti-piece";
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.setProperty("--x", `${(Math.random() - 0.5) * 360}px`);
        piece.style.setProperty("--rotation", `${Math.random() * 1000 - 500}deg`);
        piece.style.setProperty("--duration", `${2.2 + Math.random() * 2.4}s`);
        piece.style.setProperty("--color", colors[Math.floor(Math.random() * colors.length)]);
        piece.style.borderRadius = Math.random() > 0.65 ? "50%" : "1px";
        container.append(piece);
        setTimeout(() => piece.remove(), 4800);
    }
}

function setMusicPlaying(isPlaying) {
    musicButton.classList.toggle("playing", isPlaying);
    musicLabel.textContent = isPlaying ? "Pause" : "Music";
    musicButton.setAttribute("aria-label", isPlaying ? "Pause music" : "Play music");
}

async function startMusic() {
    try {
        await audio.play();
        setMusicPlaying(true);
    } catch {
    }
}

function openInvitation() {
    if (envelope.classList.contains("is-open")) return;

    envelope.classList.add("is-open");
    envelopeIntro.classList.add("opening");
    burstConfetti(70);
    startMusic();

    setTimeout(() => {
        invitation.classList.add("visible");
        invitation.setAttribute("aria-hidden", "false");
        envelopeIntro.classList.add("opened");
        document.body.classList.remove("locked");
        window.scrollTo(0, 0);
    }, 1150);

    setTimeout(() => nav.classList.add("show"), 2200);
}

waxSeal.addEventListener("click", openInvitation);

function createPetals() {
    if (reduceMotion) return;

    const petalContainer = document.querySelector("#petals");
    const petalCount = window.innerWidth < 700 ? 10 : 18;

    for (let index = 0; index < petalCount; index += 1) {
        const petal = document.createElement("i");
        petal.className = "petal";
        petal.style.left = `${Math.random() * 100}%`;
        petal.style.setProperty("--fall", `${10 + Math.random() * 10}s`);
        petal.style.setProperty("--delay", `${Math.random() * -18}s`);
        petal.style.setProperty("--drift", `${Math.random() * 130 - 65}px`);
        petal.style.transform = `scale(${0.55 + Math.random() * 0.8})`;
        petalContainer.append(petal);
    }
}

createPetals();

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.16 },
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const eventObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => entry.target.classList.toggle("in-view", entry.isIntersecting));
    },
    { threshold: 0.3 },
);

document.querySelectorAll(".event-panel").forEach((panel) => eventObserver.observe(panel));

musicButton.addEventListener("click", async () => {
    if (audio.paused) {
        await startMusic();
    } else {
        audio.pause();
        setMusicPlaying(false);
    }
});

audio.addEventListener("error", () => {
    showToast("Add a song.mp3 file to play your music");
});

function initScratchCard() {
    const card = document.querySelector("#scratchCard");
    const canvas = document.querySelector("#scratchCanvas");
    const hint = document.querySelector("#scratchHint");
    const label = document.querySelector(".scratch-label");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    let scratching = false;
    let hasCelebrated = false;

    function paintCover() {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        const bounds = card.getBoundingClientRect();
        canvas.width = Math.floor(bounds.width * ratio);
        canvas.height = Math.floor(bounds.height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);

        const gradient = context.createLinearGradient(0, 0, bounds.width, bounds.height);
        gradient.addColorStop(0, "#bca3c1");
        gradient.addColorStop(0.48, "#e4d5e3");
        gradient.addColorStop(1, "#98749c");
        context.fillStyle = gradient;
        context.fillRect(0, 0, bounds.width, bounds.height);

        context.strokeStyle = "rgba(255, 250, 240, 0.4)";
        context.lineWidth = 1;
        for (let x = -bounds.height; x < bounds.width + bounds.height; x += 18) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x + bounds.height, bounds.height);
            context.stroke();
        }

        context.fillStyle = "#5c3f60";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = `500 ${Math.max(12, bounds.width * 0.038)}px Manrope`;
        context.letterSpacing = "3px";
        context.fillText("SCRATCH HERE ✦", bounds.width / 2, bounds.height / 2);
    }

    function scratch(event) {
        if (!scratching) return;

        const bounds = canvas.getBoundingClientRect();
        const point = event.touches?.[0] || event;
        const x = point.clientX - bounds.left;
        const y = point.clientY - bounds.top;

        context.globalCompositeOperation = "destination-out";
        context.beginPath();
        context.arc(x, y, Math.max(22, bounds.width * 0.055), 0, Math.PI * 2);
        context.fill();
        hint.style.opacity = "0";

        if (!hasCelebrated && Math.random() > 0.93) {
            const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
            let transparent = 0;
            for (let index = 3; index < pixels.length; index += 160) {
                if (pixels[index] === 0) transparent += 1;
            }

            if (transparent / (pixels.length / 160) > 0.4) {
                hasCelebrated = true;
                canvas.style.opacity = "0";
                canvas.style.pointerEvents = "none";
                card.classList.add("revealed");
                label.textContent = "✦ Save our date ✦";
                label.classList.add("revealed");
                hint.textContent = "See you there";
                hint.style.opacity = "0.7";
                burstConfetti(110);
                showToast("The date is set — 26 & 27 January 2027 ✦");
            }
        }
    }

    canvas.addEventListener("pointerdown", (event) => {
        scratching = true;
        canvas.setPointerCapture(event.pointerId);
        scratch(event);
    });
    canvas.addEventListener("pointermove", scratch);
    canvas.addEventListener("pointerup", () => { scratching = false; });
    canvas.addEventListener("pointercancel", () => { scratching = false; });

    paintCover();
    window.addEventListener("resize", () => {
        if (!hasCelebrated) paintCover();
    });
}

initScratchCard();

const eventSchedule = {
    "Mehndi – The Green Gathering": {
        start: "20270126T103000",
        end: "20270126T133000",
        description: "Dress code: Shades of green, pastel sage & mint, henna motifs.",
    },
    "Rings & Revelry": {
        start: "20270126T190000",
        end: "20270126T230000",
        description: "Engagement & Sangeet Night. Dress code: Sequins, metallics and bold colours.",
    },
    "Golden Hour Blessings": {
        start: "20270127T103000",
        end: "20270127T133000",
        description: "Haldi celebration. Dress code: Yellow, mustard and marigold.",
    },
    "Two Worlds, One Love": {
        start: "20270127T190000",
        end: "20270128T000000",
        description: "Wedding ceremony. Dress code: Ethnic chic.",
    },
};

function downloadCalendarEvent(title) {
    const event = eventSchedule[title];
    const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Ankita & Himanshu//Wedding Invitation//EN",
        "BEGIN:VEVENT",
        `UID:${event.start}-${title.replace(/\W/g, "")}@himankforever`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
        `DTSTART;TZID=Asia/Kolkata:${event.start}`,
        `DTEND;TZID=Asia/Kolkata:${event.end}`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${event.description}`,
        "LOCATION:Ashok Spa & Resorts\\, Turner Road\\, Dehradun",
        "END:VEVENT",
        "END:VCALENDAR",
    ];

    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.ics`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast(`${title} added to your downloads`);
}

document.querySelectorAll("[data-reminder]").forEach((button) => {
    button.addEventListener("click", () => downloadCalendarEvent(button.dataset.reminder));
});

document.querySelector("#copyAddress").addEventListener("click", async () => {
    const address = "Ashok Spa & Resorts, Turner Road, Dehradun, Uttarakhand";
    try {
        await navigator.clipboard.writeText(address);
        showToast("Venue address copied");
    } catch {
        showToast(address);
    }
});

document.querySelector("#celebrateButton").addEventListener("click", () => {
    burstConfetti(150);
    showToast("See you at the celebration! ♡");
});

const scrollCue = document.querySelector(".scroll-cue");
if (scrollCue) {
    window.addEventListener(
        "scroll",
        () => {
            if (window.scrollY > 60) {
                scrollCue.classList.add("scroll-cue--hidden");
            }
        },
        { passive: true },
    );
}