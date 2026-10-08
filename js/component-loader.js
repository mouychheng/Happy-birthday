// Component Loader Script (Async-Safe Script Execution)
document.addEventListener("DOMContentLoaded", function () {
  const includes = document.querySelectorAll("[data-include]");

  // ប្រើ Promise.all ដំណើរការ parallel fetch
  const fetchPromises = Array.from(includes).map((el) => {
    const file = el.getAttribute("data-include");
    return loadComponentToElement(el, file);
  });

  // Load Components តាម ID (ប្រសិនបើមាន)
  loadComponent('footer-section-placeholder', 'components/footer-section.html');
  loadComponent('memories-section-placeholder', 'components/memories-section.html');
});

// Function សម្រាប់ Fetch និង Replace Component ចូលក្នុង Element
function loadComponentToElement(el, file) {
  return fetch(file)
    .then((response) => {
      if (response.ok) return response.text();
      throw new Error(`Failed to load ${file}`);
    })
    .then((html) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;

      // ១. ដកយក Script Tags ចេញ
      const scripts = Array.from(tempDiv.querySelectorAll("script"));
      scripts.forEach((s) => s.remove());

      // ២. ជំនួស Element ចាស់ដោយ Component HTML
      const childNodes = Array.from(tempDiv.childNodes);
      el.replaceWith(...childNodes);

      // ៣. Execute Scripts ឡើងវិញ
      scripts.forEach((oldScript) => {
        if (oldScript.src) {
          // បើជា External Script ដូចជា Tailwind / Confetti
          const newScript = document.createElement("script");
          Array.from(oldScript.attributes).forEach((attr) => {
            newScript.setAttribute(attr.name, attr.value);
          });
          document.head.appendChild(newScript);
        } else {
          // បើជា Inline Script ត្រូវប្រើ window.eval ដើម្បីរុញ Functions ចូល Global Scope
          try {
            window.eval(oldScript.textContent);
          } catch (err) {
            console.error("Error executing component inline script:", err);
          }
        }
      });
    })
    .catch((err) => console.error("Component Loader Error:", err));
}

// Function សម្រាប់ហៅផ្ទាល់តាម ID
function loadComponent(targetId, filePath) {
  const el = document.getElementById(targetId);
  if (el) {
    loadComponentToElement(el, filePath);
  }
}

// =========================================================
// 🎵 AUDIO CONTROL FUNCTIONS
// =========================================================

function updateAudioUI(isPlaying) {
  const icon = document.getElementById('musicIcon');
  const ping = document.getElementById('audioPing');
  const label = document.getElementById('musicLabel');

  if (isPlaying) {
    if (icon) {
      icon.innerText = "🎶";
      icon.classList.add('music-spinning');
    }
    if (ping) ping.classList.remove('hidden');
    if (label) label.innerText = "🎶 កំពុងចាក់តន្ត្រី...";
  } else {
    if (icon) {
      icon.innerText = "🎵";
      icon.classList.remove('music-spinning');
    }
    if (ping) ping.classList.add('hidden');
    if (label) label.innerText = "🎵 បើកចម្រៀង";
  }
}

function playAudioAuto() {
  const audio = document.getElementById('hbdAudio');
  if (!audio) return;

  if (audio.paused) {
    audio.play().then(() => {
      updateAudioUI(true);
    }).catch(err => console.error("Audio playback error:", err));
  } else {
    updateAudioUI(true);
  }
}

function toggleAudio() {
  const audio = document.getElementById('hbdAudio');
  if (!audio) return;

  if (audio.paused) {
    audio.play().then(() => {
      updateAudioUI(true);
    }).catch(err => console.error("Audio playback error:", err));
  } else {
    audio.pause();
    updateAudioUI(false);
  }
}

function toggleBannerMusic() {
  toggleAudio();
}