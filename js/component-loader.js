// Component Loader Script (Fixed Unwrap & Script Execution)
document.addEventListener("DOMContentLoaded", function () {
  const includes = document.querySelectorAll("[data-include]");

  includes.forEach((el) => {
    const file = el.getAttribute("data-include");
    loadComponentToElement(el, file);
  });

  // ហៅ Load Components តាម ID[cite: 15]
  loadComponent('footer-section-placeholder', 'components/footer-section.html');
  loadComponent('memories-section-placeholder', 'components/memories-section.html');
});

// Function សម្រាប់ Fetch និង Replace Component ចូលក្នុង Element[cite: 15]
function loadComponentToElement(el, file) {
  fetch(file)
    .then((response) => {
      if (response.ok) return response.text();
      throw new Error(`Failed to load ${file}`);
    })
    .then((html) => {
      // ១. បង្កើត Temp Div ដើម្បីដកស្រង់ content[cite: 15]
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;

      // ២. ដកយក Script Tags ទុកឡែកដើម្បី Execute ក្រោយពេល Insert ចូល DOM[cite: 15]
      const scripts = Array.from(tempDiv.querySelectorAll("script"));
      scripts.forEach((s) => s.remove()); // លុប Script ចាស់ចេញពី Temp[cite: 15]

      // ៣. ជំនួស <div data-include="..."> ដោយ Element របស់ Component[cite: 15]
      const childNodes = Array.from(tempDiv.childNodes);
      el.replaceWith(...childNodes);

      // ៤. Re-inject Scripts ចូលទៅក្នុង Document វិញដើម្បីឱ្យ JavaScript ដំណើរការ[cite: 15]
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

// Function សម្រាប់ហៅផ្ទាល់តាមរយៈ ID និង File Path (loadComponent)[cite: 15]
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

// Function សម្រាប់ Banner Audio Control (ហៅទៅ toggleAudio ដូចគ្នា)
function toggleBannerMusic() {
  toggleAudio();
}