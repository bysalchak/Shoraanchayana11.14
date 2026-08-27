document.addEventListener("DOMContentLoaded", () => {
    const invitationCover =
    document.getElementById("invitationCover");

  const openInvitation =
    document.getElementById("openInvitation");

  const backgroundMusic =
    document.getElementById("backgroundMusic");

  if (
    invitationCover &&
    openInvitation &&
    backgroundMusic
  ) {
    document.body.style.overflow = "hidden";

    openInvitation.addEventListener(
      "click",
      () => {
        backgroundMusic.volume = 0.8;
backgroundMusic.currentTime = 13;
backgroundMusic.play().catch((error) => {
  console.log("Музыка не запустилась:", error);
});

invitationCover.classList.add(
  "opened"
);

document.body.style.overflow = "";

window.setTimeout(() => {
  invitationCover.remove();
}, 850);

        invitationCover.classList.add(
          "opened"
        );

        document.body.style.overflow = "";

        window.setTimeout(() => {
          invitationCover.remove();
        }, 850);
      }
    );
  }
  const revealElements =
    document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver =
      new IntersectionObserver(
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
          rootMargin: "0px 0px -30px 0px"
        }
      );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  const weddingDay =
    document.getElementById("weddingDay");

  const canvas =
    document.getElementById("fireworks");

  if (!weddingDay || !canvas) {
    return;
  }

  const context =
    canvas.getContext("2d");

  if (!context) {
    weddingDay.classList.add("active");
    return;
  }

  let particles = [];

  let fireworksStarted = false;

  let animationFrame = null;

  function resizeCanvas() {
    const rect =
      canvas.getBoundingClientRect();

    const ratio =
      window.devicePixelRatio || 1;

    canvas.width =
      Math.round(rect.width * ratio);

    canvas.height =
      Math.round(rect.height * ratio);

    context.setTransform(
      ratio,
      0,
      0,
      ratio,
      0,
      0
    );
  }

  function createBurst(x, y, amount) {
    const colors = [
      "#97a47b",
      "#798565",
      "#c5b47d",
      "#dfcca0",
      "#889773",
      "#eedab0"
    ];

    for (
      let index = 0;
      index < amount;
      index += 1
    ) {
      const angle =
        (Math.PI * 2 * index) / amount;

      const speed =
        1.2 + Math.random() * 3;

      particles.push({
        x,
        y,

        vx:
          Math.cos(angle) * speed,

        vy:
          Math.sin(angle) * speed,

        alpha: 1,

        size:
          1.3 + Math.random() * 2,

        color:
          colors[
            Math.floor(
              Math.random() * colors.length
            )
          ],

        gravity:
          0.025 + Math.random() * 0.02,

        decay:
          0.009 + Math.random() * 0.012
      });
    }
  }

  function animateFireworks() {
    const rect =
      canvas.getBoundingClientRect();

    context.clearRect(
      0,
      0,
      rect.width,
      rect.height
    );

    particles = particles.filter((particle) => {
      particle.x += particle.vx;

      particle.y += particle.vy;

      particle.vx *= 0.985;

      particle.vy *= 0.985;

      particle.vy += particle.gravity;

      particle.alpha -= particle.decay;

      if (particle.alpha <= 0) {
        return false;
      }

      context.globalAlpha =
        particle.alpha;

      context.beginPath();

      context.arc(
        particle.x,
        particle.y,
        particle.size,
        0,
        Math.PI * 2
      );

      context.fillStyle =
        particle.color;

      context.fill();

      return true;
    });

    context.globalAlpha = 1;

    if (particles.length > 0) {
      animationFrame =
        window.requestAnimationFrame(
          animateFireworks
        );
    } else {
      animationFrame = null;
    }
  }

  function launchFireworks() {
    resizeCanvas();

    const canvasRect =
      canvas.getBoundingClientRect();

    const dayRect =
      weddingDay.getBoundingClientRect();

    const centerX =
      dayRect.left -
      canvasRect.left +
      dayRect.width / 2;

    const centerY =
      dayRect.top -
      canvasRect.top +
      dayRect.height / 2;

    createBurst(
      centerX,
      centerY,
      48
    );

    if (!animationFrame) {
      animateFireworks();
    }

    window.setTimeout(() => {
      createBurst(
        centerX - 31,
        centerY - 29,
        24
      );

      if (!animationFrame) {
        animateFireworks();
      }
    }, 240);

    window.setTimeout(() => {
      createBurst(
        centerX + 29,
        centerY - 20,
        22
      );

      if (!animationFrame) {
        animateFireworks();
      }
    }, 450);
  }

  if ("IntersectionObserver" in window) {
    const calendarObserver =
      new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (
              !entry.isIntersecting ||
              fireworksStarted
            ) {
              return;
            }

            fireworksStarted = true;

            window.setTimeout(() => {
              weddingDay.classList.add(
                "active"
              );

              launchFireworks();
            }, 450);

            observer.unobserve(
              entry.target
            );
          });
        },
        {
          threshold: 0.6
        }
      );

    calendarObserver.observe(
      weddingDay
    );
  } else {
    weddingDay.classList.add(
      "active"
    );
  }

  weddingDay.addEventListener(
    "click",
    launchFireworks
  );

  window.addEventListener(
    "resize",
    resizeCanvas
  );

  resizeCanvas();
});
