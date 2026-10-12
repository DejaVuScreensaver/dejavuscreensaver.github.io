const frame = document.querySelector("#demo-frame");
const slides = [...document.querySelectorAll(".slide")];
const controls = [...document.querySelectorAll(".control")];
const time = document.querySelector("#demo-time");
const details = document.querySelector(".demo-meta");
const count = document.querySelector("#demo-count");

let activeSlide = 0;

function updateTime() {
  time.textContent = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date());
}

function advanceDemo() {
  slides[activeSlide].classList.remove("active");
  slides[activeSlide].setAttribute("aria-hidden", "true");
  activeSlide = (activeSlide + 1) % slides.length;
  slides[activeSlide].classList.add("active");
  slides[activeSlide].setAttribute("aria-hidden", "false");
  count.textContent = `${activeSlide + 1} / ${slides.length}`;
}

controls.forEach((control) => {
  control.addEventListener("click", () => {
    const action = control.dataset.action;
    if (action === "static" || action === "ken-burns") {
      controls.filter((item) => item.dataset.action === "static" || item.dataset.action === "ken-burns")
        .forEach((item) => item.classList.remove("active"));
      control.classList.add("active");
      frame.classList.toggle("ken-burns", action === "ken-burns");
      return;
    }

    control.classList.toggle("active");
    if (action === "time") time.hidden = !control.classList.contains("active");
    if (action === "details") details.hidden = !control.classList.contains("active");
  });
});

updateTime();
setInterval(updateTime, 1000);
setInterval(advanceDemo, 5000);
