document.addEventListener("DOMContentLoaded", function() {
    const causeCheckbox = document.getElementById("causeCheckbox");
    causeCheckbox.checked = true;
    const sizeCheckbox = document.getElementById("sizeCheckbox");
    sizeCheckbox.checked = true;
    const yearCheckbox = document.getElementById("yearCheckbox");
    yearCheckbox.checked = true;
    const displaySizeCheckbox = document.getElementById("defaultSizeOption");
    displaySizeCheckbox.checked = true;
    const speedCheckbox = document.getElementById("defaultSpeedOption");
    speedCheckbox.checked = true;

    const elementsToFadeIn = document.querySelectorAll(
      "#map, #map-controls, #bottombar, .topbar"
    );
    elementsToFadeIn.forEach((element) => {
      element.style.opacity = '1';
    });
  });