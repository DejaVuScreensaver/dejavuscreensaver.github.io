const frame = document.querySelector("#demo-frame");
const slides = [...document.querySelectorAll(".slide")];
const controls = [...document.querySelectorAll("[data-action]")];
const time = document.querySelector("#demo-time");
const meta = document.querySelector(".demo-meta");
const countWrap = document.querySelector(".demo-count");
const count = document.querySelector("#demo-count");
const detailsPanel = document.querySelector("#detail-options");
const detailsControl = document.querySelector('[data-action="details"]');
const pauseControl = document.querySelector('[data-action="pause"]');

const memories = [
  { date: "August 16, 2025 at 8:41 PM", location: "Lake Como, Italy", filename: "IMG_1842.HEIC" },
  { date: "July 3, 2024 at 7:26 PM", location: "Adriatic Coast, Italy", filename: "IMG_0917.HEIC" },
  { date: "September 21, 2025 at 11:08 AM", location: "Dolomites, Italy", filename: "IMG_2286.HEIC" }
];

let activeSlide = 0;
let paused = false;
let slideTimer;

function updateTime() {
  const now = new Date();
  time.textContent = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  }).format(now);
}

function showSlide(index) {
  slides[activeSlide].classList.remove("active");
  slides[activeSlide].setAttribute("aria-hidden", "true");
  activeSlide = (index + slides.length) % slides.length;
  slides[activeSlide].classList.add("active");
  slides[activeSlide].setAttribute("aria-hidden", "false");

  document.querySelector("#demo-date").textContent = memories[activeSlide].date;
  document.querySelector("#demo-location").textContent = memories[activeSlide].location;
  document.querySelector("#demo-filename").textContent = memories[activeSlide].filename;
  count.textContent = `${activeSlide + 1} / ${slides.length}`;
}

function restartTimer() {
  window.clearInterval(slideTimer);
  if (!paused) slideTimer = window.setInterval(() => showSlide(activeSlide + 1), 5000);
}

function setPaused(nextPaused) {
  paused = nextPaused;
  pauseControl.classList.toggle("active", paused);
  pauseControl.querySelector(".pause-symbol").hidden = paused;
  pauseControl.querySelector(".play-symbol").hidden = !paused;
  pauseControl.setAttribute("aria-label", paused ? "Resume slideshow" : "Pause slideshow");
  pauseControl.setAttribute("aria-pressed", String(paused));
  restartTimer();
}

function syncDetailVisibility() {
  const enabled = detailsControl.checked;
  meta.hidden = !enabled;
  detailsPanel.hidden = !enabled;
  detailsControl.setAttribute("aria-expanded", String(enabled));
  countWrap.hidden = !enabled || !document.querySelector('[data-detail-toggle="count"]').checked;

  document.querySelectorAll("[data-detail-toggle]").forEach((checkbox) => {
    const detail = checkbox.dataset.detailToggle;
    if (detail !== "count") {
      document.querySelector(`[data-detail="${detail}"]`).hidden = !checkbox.checked;
    }
  });
}

controls.forEach((control) => {
  control.addEventListener(control.matches('input[type="checkbox"]') ? "change" : "click", (event) => {
    const action = control.dataset.action;
    // Mouse clicks on the on-screen keys drop focus so the physical Space/arrows keep working.
    if (event.detail && control.matches(".keyboard-key")) control.blur();

    if (action === "previous" || action === "next") {
      showSlide(activeSlide + (action === "next" ? 1 : -1));
      restartTimer();
      return;
    }

    if (action === "pause") {
      setPaused(!paused);
      return;
    }

    if (action === "static" || action === "ken-burns") {
      controls.filter((item) => item.dataset.action === "static" || item.dataset.action === "ken-burns")
        .forEach((item) => item.classList.remove("active"));
      control.classList.add("active");
      frame.classList.toggle("ken-burns", action === "ken-burns");
      return;
    }

    if (action === "time") time.hidden = !control.checked;
    if (action === "details") syncDetailVisibility();
  });
});

document.querySelectorAll("[data-detail-toggle]").forEach((checkbox) => {
  checkbox.addEventListener("change", syncDetailVisibility);
});

// Light up the on-screen key while the matching physical key is held down.
const keyFor = { ArrowLeft: ".key-left", ArrowRight: ".key-right", Space: ".key-space" };
function pressKey(event, pressed) {
  if (keyFor[event.code]) document.querySelector(keyFor[event.code]).classList.toggle("is-pressed", pressed);
}
document.addEventListener("keyup", (event) => pressKey(event, false));
window.addEventListener("blur", () => document.querySelectorAll(".keyboard-key.is-pressed").forEach((key) => key.classList.remove("is-pressed")));

document.addEventListener("keydown", (event) => {
  if (event.target.matches("input, button, a")) return;
  pressKey(event, true);
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    showSlide(activeSlide + (event.key === "ArrowRight" ? 1 : -1));
    restartTimer();
  }
  if (event.code === "Space") {
    event.preventDefault();
    setPaused(!paused);
  }
});

updateTime();
window.setInterval(updateTime, 1000);
restartTimer();

// Install guide: collapsible drawer on phones, always open on larger screens.
const installSection = document.querySelector(".install");
const installToggle = document.querySelector(".install-toggle");
const phone = window.matchMedia("(max-width: 620px)");
function setInstallOpen(open) {
  installSection.classList.toggle("is-collapsed", !open);
  installToggle.setAttribute("aria-expanded", String(open));
  installToggle.textContent = open ? "Hide steps" : "View steps";
}
installToggle.addEventListener("click", () => {
  if (phone.matches) setInstallOpen(installSection.classList.contains("is-collapsed"));
});
phone.addEventListener("change", () => setInstallOpen(!phone.matches));
setInstallOpen(!phone.matches);
