(() => {
  "use strict";

  const scene = document.querySelector("#scene");
  const slider = document.querySelector("#time-control");
  const timeLabel = document.querySelector("#time-label");
  const stars = document.querySelector("#stars");
  const controls = document.querySelector(".controls");

  if (!scene || !slider || !timeLabel || !stars) return;

  const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
  const smoothstep = (edge0, edge1, value) => {
    const position = clamp((value - edge0) / (edge1 - edge0));
    return position * position * (3 - 2 * position);
  };
  const mix = (start, end, amount) => start + (end - start) * amount;

  const SUN_PATH = {
    startY: 0.19,
    horizonY: 0.455,
    startTime: 0.04,
    horizonTime: 0.84,
  };

  let time = Number(slider.value) / 100;
  let sunX = window.matchMedia("(max-width: 720px)").matches ? 0.92 : 0.58;
  let dragging = false;

  const getPeriod = (value) => {
    if (value < 0.2) return "Morning light";
    if (value < 0.43) return "Afternoon";
    if (value < 0.7) return "Golden hour";
    if (value < 0.86) return "Twilight";
    return "Night";
  };

  const render = () => {
    const night = smoothstep(0.64, 0.94, time);
    const sunset = 1 - Math.min(Math.abs(time - 0.58) / 0.58, 1);
    const day = 1 - smoothstep(0.48, 0.82, time);
    const sunTravel = smoothstep(SUN_PATH.startTime, SUN_PATH.horizonTime, time);
    const sunY = mix(SUN_PATH.startY, SUN_PATH.horizonY, sunTravel);
    const moonProgress = smoothstep(0.72, 0.98, time);
    const moonX = 0.86 - moonProgress * 0.18;
    const moonY = 0.34 - moonProgress * 0.16;

    scene.style.setProperty("--time", time.toFixed(3));
    scene.style.setProperty("--sun-x", `${(sunX * 100).toFixed(2)}%`);
    scene.style.setProperty("--sun-y", `${(sunY * 100).toFixed(2)}%`);
    scene.style.setProperty("--sky-sun-y", `${(clamp(sunY / 0.54, 0, 1) * 100).toFixed(2)}%`);
    scene.style.setProperty("--moon-x", `${(moonX * 100).toFixed(2)}%`);
    scene.style.setProperty("--moon-y", `${(moonY * 100).toFixed(2)}%`);
    scene.style.setProperty("--day-opacity", (0.22 + day * 0.78).toFixed(3));
    scene.style.setProperty("--sunset-opacity", (0.18 + sunset * 0.82).toFixed(3));
    scene.style.setProperty("--night-opacity", night.toFixed(3));
    scene.style.setProperty("--star-opacity", smoothstep(0.7, 0.94, time).toFixed(3));
    scene.style.setProperty("--moon-opacity", smoothstep(0.78, 0.96, time).toFixed(3));
    scene.style.setProperty("--sun-opacity", (1 - smoothstep(0.68, SUN_PATH.horizonTime, time)).toFixed(3));
    scene.style.setProperty("--reflection-opacity", Math.max(0.04, (1 - night) * (0.18 + sunset * 0.72)).toFixed(3));
    scene.classList.toggle("is-deep-night", time >= 0.93);

    const value = Math.round(time * 100);
    if (Number(slider.value) !== value) slider.value = String(value);
    slider.style.setProperty("--slider-progress", `${value}%`);
    timeLabel.value = getPeriod(time);
  };

  const updateFromPointer = (event) => {
    const bounds = scene.getBoundingClientRect();
    sunX = clamp((event.clientX - bounds.left) / bounds.width, 0.08, 0.92);
    time = clamp((event.clientY - bounds.top) / bounds.height, 0.04, 0.98);
    render();
  };

  scene.addEventListener("pointerdown", (event) => {
    if (controls?.contains(event.target)) return;
    dragging = true;
    scene.setPointerCapture(event.pointerId);
    updateFromPointer(event);
  });

  scene.addEventListener("pointermove", (event) => {
    if (controls?.contains(event.target)) return;
    if (event.pointerType === "mouse" || dragging) updateFromPointer(event);
  });

  scene.addEventListener("pointerup", () => {
    dragging = false;
  });

  scene.addEventListener("pointercancel", () => {
    dragging = false;
  });

  slider.addEventListener("input", () => {
    time = Number(slider.value) / 100;
    render();
  });

  scene.addEventListener("keydown", (event) => {
    if (event.target === slider) return;
    const step = event.shiftKey ? 0.1 : 0.025;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      time = clamp(time - step, 0.04, 0.98);
      render();
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      time = clamp(time + step, 0.04, 0.98);
      render();
    } else if (event.key === "Home") {
      event.preventDefault();
      time = 0.04;
      render();
    } else if (event.key === "End") {
      event.preventDefault();
      time = 0.98;
      render();
    }
  });

  const starFragment = document.createDocumentFragment();
  for (let index = 0; index < 52; index += 1) {
    const star = document.createElement("span");
    star.className = "star";
    star.style.setProperty("--star-left", `${(index * 37.17) % 100}%`);
    star.style.setProperty("--star-top", `${8 + ((index * 53.29) % 76)}%`);
    star.style.setProperty("--star-size", `${1 + (index % 3) * 0.55}px`);
    star.style.setProperty("--star-alpha", `${0.45 + (index % 5) * 0.11}`);
    star.style.setProperty("--twinkle-duration", `${2.4 + (index % 7) * 0.43}s`);
    starFragment.appendChild(star);
  }
  stars.appendChild(starFragment);

  render();
})();
