const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -45px 0px"
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

const weddingDay = document.getElementById("weddingDay");
const canvas = document.getElementById("fireworks");
const context = canvas.getContext("2d");

let fireworksStarted = false;
let particles = [];
let animationFrame;

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;

  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;

  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function createBurst(x, y, amount = 42) {
  const colors = [
    "#9aa781",
    "#798565",
    "#c8b783",
    "#dccca3",
    "#849474",
    "#f0dcb2"
  ];

  for (let index = 0; index < amount; index += 1) {
    const angle = (Math.PI * 2 * index) / amount;
    const speed = 1.2 + Math.random() * 3.1;

    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      size: 1.4 + Math.random() * 2.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      gravity: 0.025 + Math.random() * 0.022,
      decay: 0.008 + Math.random() * 0.011
    });
  }
}

function animateFireworks() {
  const rect = canvas.getBoundingClientRect();

  context.clearRect(0, 0, rect.width, rect.height);

  particles = particles.filter((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    particle.vx *= 0.986;
    particle.vy *= 0.986;
    particle.vy += particle.gravity;

    particle.alpha -= particle.decay;

    if (particle.alpha <= 0) {
      return false;
    }

    context.globalAlpha = particle.alpha;

    context.beginPath();

    context.arc(
      particle.x,
      particle.y,
      particle.size,
      0,
      Math.PI * 2
    );

    context.fillStyle = particle.color;
    context.fill();

    return true;
  });

  context.globalAlpha = 1;

  if (particles.length) {
    animationFrame = requestAnimationFrame(animateFireworks);
  }
}

function launchFireworks() {
  resizeCanvas();

  const canvasRect = canvas.getBoundingClientRect();
  const dayRect = weddingDay.getBoundingClientRect();

  const centerX =
    dayRect.left - canvasRect.left + dayRect.width / 2;

  const centerY =
    dayRect.top - canvasRect.top + dayRect.height / 2;

  createBurst(centerX, centerY, 52);

  window.setTimeout(() => {
    createBurst(centerX - 35, centerY - 35, 28);

    if (!particles.length) {
      animateFireworks();
    }
  }, 240);

  window.setTimeout(() => {
    createBurst(centerX + 32, centerY - 22, 26);

    if (!particles.length) {
      animateFireworks();
    }
  }, 480);

  cancelAnimationFrame(animationFrame);
  animateFireworks();
}

const calendarObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || fireworksStarted) {
        return;
      }

      fireworksStarted = true;

      window.setTimeout(() => {
        weddingDay.classList.add("active");
        launchFireworks();
      }, 520);

      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.6
  }
);

calendarObserver.observe(weddingDay);

weddingDay.addEventListener("click", launchFireworks);

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
