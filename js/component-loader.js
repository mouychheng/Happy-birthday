// Component Loader Script (Async-Safe Script Execution)
document.addEventListener("DOMContentLoaded", function () {
  const includes = document.querySelectorAll("[data-include]");

  // ប្រើ Promise.all ដើម្បីឱ្យប្រាកដថា Parallel fetches ដំណើរការបានត្រឹមត្រូវ
  const fetchPromises = Array.from(includes).map((el) => {
    const file = el.getAttribute("data-include");
    return loadComponentToElement(el, file);
  });

  // Load Components តាម ID
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
      // ១. បង្កើត Temp Div ដើម្បីដកស្រង់ content
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;

      // ២. ដកយក Script Tags ទុកឡែកដើម្បី Execute ក្រោយពេល Insert ចូល DOM
      const scripts = Array.from(tempDiv.querySelectorAll("script"));
      scripts.forEach((s) => s.remove()); // លុប Script ចាស់ចេញពី Temp

      // ៣. ជំនួស <div data-include="..."> ដោយ Element របស់ Component
      const childNodes = Array.from(tempDiv.childNodes);
      el.replaceWith(...childNodes);

      // ៤. Re-inject Scripts ចូលទៅក្នុង Document វិញដើម្បីឱ្យ JavaScript ដំណើរការ
      scripts.forEach((oldScript) => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach((attr) =>
          newScript.setAttribute(attr.name, attr.value)
        );
        newScript.textContent = oldScript.textContent;
        document.body.appendChild(newScript);
      });
    })
    .catch((err) => console.error("Component Loader Error:", err));
}

// Function សម្រាប់ហៅផ្ទាល់តាមរយៈ ID និង File Path (loadComponent)
function loadComponent(targetId, filePath) {
  const el = document.getElementById(targetId);
  if (el) {
    loadComponentToElement(el, filePath);
  } else {
    console.warn(`Element with ID '${targetId}' not found.`);
  }
}

// =========================================================
// 🎵 AUDIO CONTROL FUNCTIONS (Synchronized All Buttons)
// =========================================================

// Function សម្រាប់ Update UI របស់ប៊ូតុងតន្ត្រីទាំងអស់ក្នុងពេលតែមួយ
function updateAudioUI(isPlaying) {
  // 1. Floating Audio Control Widgets
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

// Function បង្ខំបើកចម្រៀងអូតូ (ប្រើពេលចុចប៊ូតុង Grand Celebration)
function playAudioAuto() {
  const audio = document.getElementById('hbdAudio');
  if (!audio) {
    console.error("រកមិនឃើញ Element #hbdAudio ទេ");
    return;
  }

  if (audio.paused) {
    audio.play().then(() => {
      updateAudioUI(true);
    }).catch(err => {
      console.error("Audio playback error:", err);
    });
  } else {
    updateAudioUI(true);
  }
}

// Function បើក/បិទចម្រៀង (Toggle)
function toggleAudio() {
  const audio = document.getElementById('hbdAudio');
  if (!audio) {
    console.error("រកមិនឃើញ Element #hbdAudio ទេ");
    return;
  }

  if (audio.paused) {
    audio.play().then(() => {
      updateAudioUI(true);
    }).catch(err => {
      console.error("Audio playback error:", err);
    });
  } else {
    audio.pause();
    updateAudioUI(false);
  }
}

// Function សម្រាប់ Banner Audio Control
function toggleBannerMusic() {
  toggleAudio();
}