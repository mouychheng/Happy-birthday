// Component Loader Script
document.addEventListener("DOMContentLoaded", function () {
  const includes = document.querySelectorAll("[data-include]");
  
  let promises = Array.from(includes).map(el => {
    const file = el.getAttribute("data-include");
    return fetch(file)
      .then(response => {
        if (response.ok) return response.text();
        throw new Error(`Failed to load ${file}`);
      })
      .then(html => {
        el.innerHTML = html;
        // Run inline scripts if present in components
        const scripts = el.querySelectorAll("script");
        scripts.forEach(oldScript => {
          const newScript = document.createElement("script");
          Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
          newScript.appendChild(document.createTextNode(oldScript.innerHTML));
          oldScript.parentNode.replaceChild(newScript, oldScript);
        });
      })
      .catch(err => console.error(err));
  });
});