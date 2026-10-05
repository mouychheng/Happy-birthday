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