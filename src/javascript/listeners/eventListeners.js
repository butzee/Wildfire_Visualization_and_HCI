// Get references to DOM elements
const buttonSQL = document.getElementById('queryButton');
const slider = document.getElementById('rangeSlider');
const startPauseButton = d3.select("#start_pause");
const stopButton = d3.select("#stop");
const updateScatterHelperButton = d3.select("#updateScatterHelper");

// Declare variables
let yearsArray;
let isDragging = false;
let myTimer;

// Event listeners

/**
 * Event listener for the SQL query button click
 * Fetches fires data based on selected options and updates the display
 */
buttonSQL.addEventListener('click', async () => {
    const year = getSelectedValues('#yearDropdownContent input[type="checkbox"]');
    const causeOptions = getSelectedValues('#causeDropdownContent input[type="checkbox"]');
    const sizeOptions = getSelectedValues('#sizeDropdownContent input[type="checkbox"]');
    const button = document.getElementById("displayType");

    if (button.classList.contains('disabled')) {
        // Enable the display type button if it's disabled
        button.classList.remove('disabled');
        button.style.color = "white";
    }

    try {
        showLoadingAnimation();
        // Fetch fires data based on selected options
        yearsArray = await window.electronAPI.getFires(year, causeOptions, sizeOptions);
        showLoadingAnimation();
        d3.select("#rangeSlider")
            .property("min", 0)
            .property("max", areAllYearsDisplayed() ? 28 : 365);
    } catch (error) {
        console.error(error);
    }
    stopButton.on("click")();

    // Update scatter or cluster based on current display type
    scatter ? updateScatter(0) : updateCluster(0);
    updateTimeDisplay();
});

/**
 * Event listener for the slider mousedown event
 * Sets the isDragging flag to true
 */
slider.addEventListener('mousedown', () => isDragging = true);

/**
 * Event listener for the slider mouseup event
 * Sets the isDragging flag to false
 */
slider.addEventListener('mouseup', () => isDragging = false);

/**
 * Event listener for the slider change event
 * Handles the slider change and triggers the corresponding action
 */
slider.addEventListener('change', handleSliderChange);

/**
 * Event listener for the slider input event
 * Handles the slider input and triggers the corresponding action
 */
slider.addEventListener('input', handleSliderChange);

/**
 * Event listener for the start/pause button click
 * Starts or pauses the animation based on the current state
 */
startPauseButton.on("click", () => {
    const rangeSlider = d3.select("#rangeSlider");
    const maxValue = +rangeSlider.property("max");

    if (!isAnimating()) {
        if (+rangeSlider.property("value") === maxValue) {
            rangeSlider.property("value", 0);
            updateTimeDisplay();
        }
        play();
    } else {
        pause();
    }
    displayNextAnimationState(isAnimating() ? "play_arrow" : "pause");
});

/**
 * Event listener for the stop button click
 * Stops the animation and resets the display
 */
stopButton.on("click", () => {
    // Stop button click handler
    d3.select("#rangeSlider").property("value", 0);
    clearInterval(myTimer);
    document.getElementById("start_pause").firstElementChild.innerHTML = "play_arrow";
    scatter ? updateScatter(0) : updateCluster(0);
    updateTimeDisplay();
});

/**
 * Event listener for the scatter helper update button click
 * Updates the scatter or cluster based on the current display type and slider value
 */
updateScatterHelperButton.on("click", () => {
    // Update scatter or cluster based on current display type and slider value
    scatter ? updateScatter(document.getElementById('rangeSlider').value) : updateCluster(document.getElementById('rangeSlider').value);
});