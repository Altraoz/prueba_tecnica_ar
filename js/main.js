// ===== Utilidades =====
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// ===== Carrusel Vanilla =====
(function initCarousel() {
  const root = document.querySelector("[data-carousel]");
  if (!root) return;
  const track = $(".carousel__track", root);
  const slides = $$(".carousel__slide", root);
  const btnPrev = $(".carousel__btn--prev", root);
  const btnNext = $(".carousel__btn--next", root);
  const dotsWrap = $(".carousel__dots", root);

  let index = 0;
  const goTo = (i) => {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(${index * -100}%)`;
    // update dots
    $$(".carousel__dots button", root).forEach((b, j) => {
      b.setAttribute("aria-current", j === index ? "true" : "false");
    });
  };

  // Dots
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `Ir a la diapositiva ${i + 1}`);
    b.setAttribute("aria-current", i === 0 ? "true" : "false");
    b.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(b);
  });

  btnPrev?.addEventListener("click", () => goTo(index - 1));
  btnNext?.addEventListener("click", () => goTo(index + 1));

  // Arrastre con mouse/touch
  let startX = 0,
    isDown = false;
  const viewport = $(".carousel__viewport", root);
  viewport.addEventListener("pointerdown", (e) => {
    isDown = true;
    startX = e.clientX;
    viewport.setPointerCapture(e.pointerId);
  });
  viewport.addEventListener("pointerup", (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    if (dx > 40) goTo(index - 1);
    if (dx < -40) goTo(index + 1);
    isDown = false;
  });

  // Auto-play suave (pausa al interactuar)
  let timer = setInterval(() => goTo(index + 1), 5000);
  [btnPrev, btnNext, viewport].forEach((el) =>
    el?.addEventListener("pointerdown", () => {
      clearInterval(timer);
      timer = null;
    })
  );
})();

// ===== Validación básica del formulario =====
(function initFormValidation() {
  const form = $(".form");
  if (!form) return;

  const setError = (id, msg) => {
    const p = document.querySelector(`[data-error-for="${id}"]`);
    if (p) p.textContent = msg || "";
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;

    const name = $("#name");
    const email = $("#email");
    const message = $("#message");

    if (!name.value.trim()) {
      setError("name", "El nombre es obligatorio.");
      ok = false;
    } else setError("name");
    if (!email.value.trim() || !/.+@.+\..+/.test(email.value)) {
      setError("email", "Email inválido.");
      ok = false;
    } else setError("email");
    if (!message.value.trim()) {
      setError("message", "El mensaje es obligatorio.");
      ok = false;
    } else setError("message");

    if (ok) {
      $(".form__success").hidden = false;
      form.reset();
      setTimeout(() => {
        $(".form__success").hidden = true;
      }, 3500);
    }
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav__toggle");
  const nav = document.getElementById("nav");

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", !expanded);
    nav.classList.toggle("is-active");
  });
});
