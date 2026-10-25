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

const osInfo = document.querySelector(".os-info");
const osTooltip = document.querySelector("#os-compatibility");
const osRequirement = osInfo.closest(".os-requirement");
function showCompatibilityInfo(show) {
  osTooltip.hidden = !show;
  osInfo.setAttribute("aria-expanded", String(show));
}
osInfo.addEventListener("pointerenter", (event) => {
  if (event.pointerType === "mouse") showCompatibilityInfo(true);
});
osRequirement.addEventListener("pointerleave", (event) => {
  if (event.pointerType === "mouse" && !osInfo.matches(":focus-visible")) showCompatibilityInfo(false);
});
osInfo.addEventListener("focus", () => {
  if (osInfo.matches(":focus-visible")) showCompatibilityInfo(true);
});
osInfo.addEventListener("blur", () => showCompatibilityInfo(false));
osInfo.addEventListener("click", () => showCompatibilityInfo(osTooltip.hidden));
document.addEventListener("pointerdown", (event) => {
  if (!osRequirement.contains(event.target)) showCompatibilityInfo(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") showCompatibilityInfo(false);
});

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

// Settings window: a scripted cursor opens the menu-bar menu, picks Settings…, then the window opens.
const settingsReveal = document.querySelector(".settings-reveal");
const menuApp = settingsReveal.querySelector(".mb-app");
const cursor = settingsReveal.querySelector(".mb-cursor");
const clock = document.querySelector("#mb-clock");

function updateClock() {
  const now = new Date();
  const day = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" }).format(now).replace(",", "");
  const hm = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(now);
  clock.textContent = `${day}  ${hm}`;
}
updateClock();
window.setInterval(updateClock, 10000);

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
function pointAt(element) {
  const box = element.getBoundingClientRect();
  const stage = settingsReveal.getBoundingClientRect();
  return [box.left - stage.left + box.width * 0.45, box.top - stage.top + box.height * 0.45];
}
function moveCursor(to, duration) {
  const from = cursor.dataset.at ? JSON.parse(cursor.dataset.at) : to;
  cursor.dataset.at = JSON.stringify(to);
  return cursor.animate([
    { transform: `translate(${from[0]}px, ${from[1]}px)` },
    { transform: `translate(${to[0]}px, ${to[1]}px)` }
  ], { duration, easing: "cubic-bezier(.45, 0, .2, 1)", fill: "forwards" }).finished;
}
function hover(item) {
  menuApp.querySelectorAll(".mb-menu span").forEach((row) => row.classList.toggle("is-hover", row === item));
}

async function playSettingsIntro() {
  const startItem = menuApp.querySelector('[data-item="start"]');
  const settingsItem = menuApp.querySelector('[data-item="settings"]');
  const icon = pointAt(menuApp);
  await moveCursor([icon[0] - 170, icon[1] + 150], 0);
  settingsReveal.classList.add("is-playing");
  await wait(300);
  await moveCursor(icon, 950);
  await wait(150);
  menuApp.classList.add("is-active", "is-open");
  await wait(450);
  await moveCursor(pointAt(startItem), 450);
  hover(startItem);
  await wait(250);
  await moveCursor(pointAt(settingsItem), 380);
  hover(settingsItem);
  await wait(450);
  hover(null); await wait(70); hover(settingsItem); await wait(90);
  menuApp.classList.add("is-closing");
  menuApp.classList.remove("is-active", "is-open");
  await wait(250);
  settingsReveal.classList.add("is-open");
  settingsReveal.querySelector("video").play().catch(() => {});
}

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  settingsReveal.classList.add("is-ready");
  const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();
    playSettingsIntro().catch(() => settingsReveal.classList.add("is-open"));
  }, { threshold: 1 });
  observer.observe(settingsReveal.querySelector(".mac-menubar"));
}

// Live release version and download count from GitHub.
// The count is hidden when zero; both keep their HTML fallback on failure.
const DL_MIN = 1;
const DL_KEY = "release-info-v3";
const dlEls = [...document.querySelectorAll(".dl-count")];

async function releaseInfo() {
  try {
    const cached = JSON.parse(sessionStorage.getItem(DL_KEY) || "null");
    if (cached && Date.now() - cached.t < 10 * 60 * 1000) return cached;
  } catch {}
  const res = await fetch("https://api.github.com/repos/DejaVuScreensaver/DejaVuScreensaver/releases?per_page=100");
  if (!res.ok) throw new Error(res.status);
  const releases = await res.json();
  const latest = releases[0];
  const version = latest.name?.match(/\d+\.\d+\.\d+(?: \(\d+\))?/)?.[0] || latest.tag_name.replace(/^v/, "");
  const downloads = releases.flatMap((r) => r.assets).filter((a) => a.name.endsWith(".dmg")).reduce((sum, a) => sum + a.download_count, 0);
  const info = { version, downloads, t: Date.now() };
  try { sessionStorage.setItem(DL_KEY, JSON.stringify(info)); } catch {}
  return info;
}

function countUp(el, n) {
  const b = el.querySelector("b");
  const fmt = new Intl.NumberFormat("en-US");
  el.hidden = false;
  el.lastChild.textContent = n === 1 ? " download" : " downloads";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { b.textContent = fmt.format(n); return; }
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / 1400, 1);
    b.textContent = fmt.format(Math.round(n * (1 - Math.pow(1 - p, 4))));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

if (dlEls.length) {
  releaseInfo().then(({ version, downloads }) => {
    document.querySelectorAll(".release-version").forEach((el) => { el.textContent = `v${version}`; });
    if (downloads < DL_MIN) return;
    if (!("IntersectionObserver" in window)) return dlEls.forEach((el) => countUp(el, downloads));
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      countUp(e.target.querySelector(".dl-count"), downloads);
    }));
    dlEls.forEach((el) => io.observe(el.closest(".download-action")));
  }).catch(() => {});
}

// "View demo": centre the iMac + keyboard in the viewport instead of jumping to the section top.
document.querySelectorAll('a[href="#demo"]').forEach((link) => link.addEventListener("click", (event) => {
  const imac = document.querySelector(".imac").getBoundingClientRect();
  const bottom = Math.max(...[".keyboard-controls p", ".demo-settings-window", ".mobile-notice"]
    .map((s) => document.querySelector(s)?.getBoundingClientRect()).filter((r) => r && r.height).map((r) => r.bottom));
  const top = imac.top + imac.width * .0973; // the iMac image has transparent space above the bezel
  event.preventDefault();
  window.scrollTo({ top: scrollY + top - Math.max(24, (innerHeight - (bottom - top)) / 2), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}));

const imacBox = document.querySelector(".imac");
new ResizeObserver(() => imacBox.style.setProperty("--panel-s", Math.max(.8, imacBox.offsetWidth / 1020))).observe(imacBox);

// Hero posts: drop one Apple Community post onto the pile every few seconds while it is on screen.
const pile = document.querySelector(".post-pile");
if (pile) {
  const posts = [...pile.querySelectorAll(".post")];
  const tilt = [-2.5, 2, -1.5, 2.5, -2, 1.5, -1];
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let top = -1, shown = 0, timer = null, onScreen = false, hovered = false;
  const fit = () => { pile.style.height = Math.max(...posts.map((p) => p.offsetHeight)) + 40 + "px"; };
  const place = (dir = 1) => posts.forEach((post, k) => {
    const age = (top - k + posts.length) % posts.length;
    const visible = age < Math.min(4, shown);
    if (dir < 0 && age === posts.length - 1 && !still) { // going back: lift the old top card off the pile
      post.style.transform = `translateY(-80px) scale(1.08) rotate(${tilt[k]}deg)`;
      post.style.opacity = 0;
      post.style.pointerEvents = "none";
      setTimeout(() => { if (post.style.opacity === "0") post.style.visibility = "hidden"; }, 600);
      return;
    }
    if (dir > 0 && age === 0 && !still) {
      post.style.transition = "none";
      post.style.transform = `translateY(-80px) scale(1.08) rotate(${tilt[k]}deg)`;
      post.style.opacity = 0;
      post.offsetWidth;
      post.style.transition = "";
    }
    post.style.pointerEvents = "";
    post.style.zIndex = 10 - age;
    post.style.transform = `rotate(${tilt[k]}deg) translate(${(k % 2 ? 1 : -1) * age * 5}px, ${age * 4}px)`;
    post.style.opacity = visible ? 1 : 0;
    post.style.visibility = visible ? "visible" : "hidden";
    post.classList.toggle("is-top", age === 0);
  });
  const next = () => { top = (top + 1) % posts.length; shown++; place(); };
  const prev = () => { top = (top - 1 + posts.length) % posts.length; place(-1); };
  const sync = () => {
    const run = onScreen && !hovered;
    if (run && !timer) timer = shown ? setInterval(next, still ? 6000 : 4000) : setTimeout(() => { timer = null; next(); sync(); }, 0);
    if (!run && timer) { clearInterval(timer); clearTimeout(timer); timer = null; }
  };
  fit(); addEventListener("resize", fit); document.fonts?.ready.then(fit);
  posts.forEach((p) => { p.style.opacity = 0; p.style.visibility = "hidden"; });
  pile.addEventListener("mouseenter", () => { hovered = true; sync(); });
  pile.addEventListener("mouseleave", () => { hovered = false; sync(); });
  pile.addEventListener("focusin", () => { hovered = true; sync(); });
  pile.addEventListener("focusout", () => { hovered = false; sync(); });
  new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); }, { threshold: .35 }).observe(pile);
  document.querySelectorAll("[data-pile]").forEach((btn) => btn.addEventListener("click", () => {
    if (btn.dataset.pile > 0 || shown < 2) next(); else prev();
    clearInterval(timer); clearTimeout(timer); timer = null; sync(); // restart the auto-advance countdown
  }));
}
