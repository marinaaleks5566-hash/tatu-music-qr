const audio = document.getElementById("audio");
const toggle = document.getElementById("play-toggle");
const icon = toggle.querySelector(".player__icon");
const progress = document.getElementById("progress");
const elapsed = document.getElementById("elapsed");
const duration = document.getElementById("duration");
const status = document.getElementById("status");

function formatTime(value) {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function setPlaying(playing) {
  toggle.setAttribute("aria-pressed", String(playing));
  toggle.setAttribute("aria-label", playing ? "Поставить на паузу" : "Включить песню");
  icon.textContent = playing ? "Ⅱ" : "▶";
  status.textContent = playing ? "Припев играет" : "Пауза";
}

async function tryAutoplay() {
  try {
    await audio.play();
  } catch {
    setPlaying(false);
    status.textContent = "Браузер ждёт вашего нажатия";
  }
}

window.addEventListener("load", tryAutoplay);

toggle.addEventListener("click", async () => {
  if (audio.paused) {
    try {
      await audio.play();
    } catch {
      status.textContent = "Не удалось включить песню. Нажмите ещё раз.";
      setPlaying(false);
    }
  } else {
    audio.pause();
  }
});

audio.addEventListener("play", () => setPlaying(true));
audio.addEventListener("pause", () => setPlaying(false));
audio.addEventListener("loadedmetadata", () => {
  progress.max = String(audio.duration || 42);
  duration.textContent = formatTime(audio.duration || 42);
});
audio.addEventListener("timeupdate", () => {
  progress.value = String(audio.currentTime);
  elapsed.textContent = formatTime(audio.currentTime);
});
audio.addEventListener("ended", () => {
  audio.currentTime = 0;
  setPlaying(false);
  status.textContent = "Нажмите, чтобы включить ещё раз";
});
audio.addEventListener("error", () => {
  audio.pause();
  setPlaying(false);
  status.textContent = "Песня временно недоступна";
});

progress.addEventListener("input", () => {
  audio.currentTime = Number(progress.value);
});
