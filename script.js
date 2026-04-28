const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navLinksContainer = document.getElementById("navLinks");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const typingTextElement = document.getElementById("typingText");
const feedbackTrack = document.getElementById("feedbackTrack");
const nextFeedbackBtn = document.getElementById("nextFeedback");
const prevFeedbackBtn = document.getElementById("prevFeedback");

const STORAGE_KEY = "portfolio-theme";

function applyTheme(theme) {
  const isLight = theme === "light";
  body.classList.toggle("light-mode", isLight);
  themeToggle.innerHTML = isLight
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
  themeToggle.setAttribute(
    "aria-label",
    isLight ? "Switch to dark mode" : "Switch to light mode"
  );
}

function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme) {
    applyTheme(savedTheme);
    return;
  }

  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(prefersLight ? "light" : "dark");
}

themeToggle.addEventListener("click", () => {
  const isLight = body.classList.contains("light-mode");
  const nextTheme = isLight ? "dark" : "light";
  applyTheme(nextTheme);
  localStorage.setItem(STORAGE_KEY, nextTheme);
});

menuToggle.addEventListener("click", () => {
  navLinksContainer.classList.toggle("open");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinksContainer.classList.remove("open");
  });
});

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY + 130;
  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach((link) => link.classList.remove("active"));
      const currentLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (currentLink) currentLink.classList.add("active");
    }
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const typingWords = [
  "cross-platform mobile apps.",
  "clean architecture solutions.",
  "smooth and modern user experiences.",
  "scalable Flutter products.",
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function runTypingEffect() {
  const currentWord = typingWords[wordIndex];
  if (isDeleting) {
    charIndex -= 1;
  } else {
    charIndex += 1;
  }

  typingTextElement.textContent = currentWord.slice(0, charIndex);

  if (!isDeleting && charIndex === currentWord.length) {
    isDeleting = true;
    setTimeout(runTypingEffect, 1100);
    return;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % typingWords.length;
  }

  setTimeout(runTypingEffect, isDeleting ? 45 : 85);
}

let feedbackIndex = 0;

function getCardsPerView() {
  if (window.innerWidth <= 720) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

function updateFeedbackSlider() {
  const cards = feedbackTrack.querySelectorAll(".feedback-card");
  if (!cards.length) return;

  const cardsPerView = getCardsPerView();
  const maxIndex = Math.max(0, cards.length - cardsPerView);
  if (feedbackIndex > maxIndex) {
    feedbackIndex = maxIndex;
  }

  const firstCardWidth = cards[0].offsetWidth;
  const gap = 16;
  const offset = feedbackIndex * (firstCardWidth + gap);
  feedbackTrack.style.transform = `translateX(-${offset}px)`;
}

nextFeedbackBtn.addEventListener("click", () => {
  const cards = feedbackTrack.querySelectorAll(".feedback-card");
  const cardsPerView = getCardsPerView();
  const maxIndex = Math.max(0, cards.length - cardsPerView);
  feedbackIndex = feedbackIndex >= maxIndex ? 0 : feedbackIndex + 1;
  updateFeedbackSlider();
});

prevFeedbackBtn.addEventListener("click", () => {
  const cards = feedbackTrack.querySelectorAll(".feedback-card");
  const cardsPerView = getCardsPerView();
  const maxIndex = Math.max(0, cards.length - cardsPerView);
  feedbackIndex = feedbackIndex <= 0 ? maxIndex : feedbackIndex - 1;
  updateFeedbackSlider();
});

window.addEventListener("resize", updateFeedbackSlider);

initTheme();
runTypingEffect();
updateFeedbackSlider();
