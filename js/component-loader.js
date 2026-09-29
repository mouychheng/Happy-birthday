// Component Loader Script (Fixed Unwrap Issue)
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
        // បង្កើត temporary container ដើម្បី parse HTML
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;

        // Execute scripts បើមានក្នុង component
        const scripts = tempDiv.querySelectorAll("script");
        scripts.forEach(oldScript => {
          const newScript = document.createElement("script");
          Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
          newScript.appendChild(document.createTextNode(oldScript.innerHTML));
          oldScript.parentNode.replaceChild(newScript, oldScript);
        });

        // ជំនួស <div data-include="..."> ដោយ Child nodes ផ្ទាល់តែម្តង (Unwrap)
        el.replaceWith(...tempDiv.childNodes);
      })
      .catch(err => console.error(err));
  });
});