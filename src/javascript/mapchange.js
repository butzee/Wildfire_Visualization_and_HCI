
function changePageMap(event, href) {        
    event.preventDefault(); // Prevent the page from changing immediately
    const elementsToMoveOut = document.querySelectorAll(
      "#map, #map-controls, #bottombar, .topbar"
    );
    elementsToMoveOut.forEach((element) => {
      element.style.opacity = '0';
    });
    const main = document.querySelector(".main");
    main.addEventListener("transitionend", () => {
      window.location.href = href
    });
}

function changePage(event, href) {
  event.preventDefault(); // Prevent the page from changing immediately
  const mainWindow = document.querySelector(".mainwindow");
  //border left invisible:

  mainWindow.style.transform = 'translateY(-100%)';

  // Add the transitionend event listener to mainWindow
  mainWindow.addEventListener("transitionend", () => {
    // Transition animation has finished, now navigate to the new page
    window.location.href = href
  });
}