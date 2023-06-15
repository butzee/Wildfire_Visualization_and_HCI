/*
Explanation:
The code uses the DOMContentLoaded event listener to ensure that the code runs after the DOM content has been fully loaded.
Initially, the main window element is shifted upwards by applying a translateY transform with a value of -100%.
This effectively moves the element out of the visible area. After a delay of 150 milliseconds,
the transform is reset by setting the translateY value to 0%, causing the main window element to
slide back down into the visible area.
The code adds a smooth transition effect to the main window element,
making it appear as if it's sliding into view.
*/

// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Get the main window element
    const mainWindow = document.querySelector(".mainwindow");

    // Slide the main window element up by applying a translateY transform
    mainWindow.style.transform = 'translateY(-100%)';

    // After a delay of 150 milliseconds, slide the main window element back down
    setTimeout(function () {
        mainWindow.style.transform = 'translateY(0%)';
    }, 150);
});