const header = document.querySelector("[data-elevate]");
const counters = document.querySelectorAll("[data-count]");
const revealItems = document.querySelectorAll(".reveal");

const updateHeader = () => {
  header?.classList.toggle("is-elevated", window.scrollY > 8);
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const easeOut = (value) => 1 - Math.pow(1 - value, 3);

const runCounter = (element) => {
  if (element.dataset.done) return;
  element.dataset.done = "true";

  const target = Number(element.dataset.count);
  const suffix = element.dataset.suffix || "";
  const start = performance.now();
  const duration = 980;

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.round(target * easeOut(progress));
    element.textContent = `${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add("is-visible");
    entry.target.querySelectorAll?.("[data-count]").forEach(runCounter);

    if (entry.target.matches("[data-count]")) {
      runCounter(entry.target);
    }

    observer.unobserve(entry.target);
  });
}, { threshold: 0.16 });

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
  observer.observe(item);
});

counters.forEach((counter) => observer.observe(counter));

window.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
