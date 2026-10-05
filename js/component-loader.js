// Component Loader Script (Fixed Unwrap & Script Execution)
document.addEventListener("DOMContentLoaded", function () {
  const includes = document.querySelectorAll("[data-include]");

  includes.forEach((el) => {
    const file = el.getAttribute("data-include");

    fetch(file)
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
  });
});

// បន្ថែម Function នេះក្នុង js/component-loader.js ឬ index.html
function toggleBannerMusic() {
  const audio = document.getElementById('hbdAudio');
  const icon = document.getElementById('bannerMusicIcon');
  const text = document.getElementById('bannerMusicText');
  const btn = document.getElementById('bannerMusicToggleBtn');

  if (!audio) {
    console.error("រកមិនឃើញ Element #hbdAudio ទេ");
    return;
  }

  if (audio.paused) {
    audio.play().then(() => {
      if (icon) icon.innerText = "⏸️";
      if (text) text.innerText = "បិទចម្រៀង";
      if (btn) btn.classList.add('bg-pink-200', 'dark:bg-pink-900');
    }).catch(err => {
      console.error("Audio playback error:", err);
    });
  } else {
    audio.pause();
    if (icon) icon.innerText = "🎵";
    if (text) text.innerText = "ចុចស្តាប់ចម្រៀង HBD";
    if (btn) btn.classList.remove('bg-pink-200', 'dark:bg-pink-900');
  }
}

loadComponent('footer-section-placeholder', 'components/footer-section.html');