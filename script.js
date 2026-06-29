const header = document.querySelector("[data-elevate]");
const counters = document.querySelectorAll("[data-count]");
const revealItems = document.querySelectorAll(".reveal");
const themeToggle = document.querySelector("[data-theme-toggle]");
const archiveButtons = document.querySelectorAll("[data-filter]");
const archiveItems = document.querySelectorAll("[data-category]");

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

const setTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("portfolio-theme", theme);

  const icon = theme === "dark" ? "sun" : "moon";
  themeToggle?.querySelector("i")?.setAttribute("data-lucide", icon);

  if (window.lucide) {
    window.lucide.createIcons();
  }
};

const savedTheme = localStorage.getItem("portfolio-theme");
setTheme(savedTheme || (prefersDark.matches ? "dark" : "light"));

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

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
});

archiveButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    archiveButtons.forEach((item) => item.classList.toggle("is-active", item === button));

    archiveItems.forEach((item) => {
      const categories = item.dataset.category?.split(" ") || [];
      const shouldShow = filter === "all" || categories.includes(filter);
      item.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

window.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
