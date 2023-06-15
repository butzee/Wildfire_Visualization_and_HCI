// Check if any checkbox option is selected among the given checkboxes
function anyCheckboxOptionSelected(checkboxes) {
    for (let checkbox of checkboxes) {
        if (checkbox.checked) return true;
    }
    return false;
}

// Get the selected values of checkboxes matching the given selector
function getSelectedValues(selector) {
    return Array.from(document.querySelectorAll(`${selector}:checked`), checkbox => checkbox.value);
}

// Check if all years are displayed based on the selected year checkboxes
function areAllYearsDisplayed() {
    return getSelectedValues('#yearDropdownContent input[type="checkbox"]')[0] === "-1";
}

// Show or hide the loading animation
function showLoadingAnimation() {
    document.getElementById("load").classList.toggle("show-options");
}

// Get the formatted date for the given day and year
function getDate(day, year) {
    const date = new Date(year, 0);
    date.setDate(day);
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('de-DE', options);
}

// Update the time display based on the selected options
function updateTimeDisplay() {
    if (document.getElementById("yearCheckbox").checked) {
        document.getElementById("current-year").innerText = "Current year: " + String(Number(document.getElementById('rangeSlider').value) + 1992);
    } else {
        const day = Number(document.getElementById('rangeSlider').value) + 1;
        const year = document.querySelector('#yearDropdownContent input[type="checkbox"]:checked').value;
        document.getElementById("current-year").innerText = "Current date: " + getDate(day, year);
    }
}

// Check if the animation is currently running
function isAnimating() {
    const button = document.getElementById("start_pause");
    return button.firstElementChild.innerHTML === "pause";
}

// Display the next animation state on the start/pause button
function displayNextAnimationState(state) {
    const button = document.getElementById("start_pause");
    button.firstElementChild.innerHTML = state;
}

// Play the animation based on the selected options
function play() {
    clearInterval(myTimer);
    const b = d3.select("#rangeSlider");
    const maxValue = +b.property("max");
    const speed = Number(Array.from(document.querySelectorAll('#speedDropdownContent input[type="checkbox"]:checked'))[0].value);

    myTimer = setInterval(() => {
        const value = +b.property("value") + 1;

        scatter ? updateScatter(value) : updateCluster(value);
        if (value > maxValue) {
            clearInterval(myTimer);
            displayNextAnimationState("play_arrow");
        } else {
            b.property("value", value);
        }
        updateTimeDisplay();
    }, 1000 / speed);
}

// Pause the animation
function pause() {
    clearInterval(myTimer);
}

// Toggle the visibility of the dropdown content
function toggleDropdown(event) {
    var dropdown = event.target.closest('.dropdown').querySelector('.dropdown-content');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Hide the dropdown content
function hideDropdown(event) {
    var dropdown = event.target.closest('.dropdown').querySelector('.dropdown-content');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}

// Handle the change event of the slider
function handleSliderChange(event) {
    if (!isDragging) {
        const value = event.target.value;
        scatter ? updateScatter(value) : updateCluster(value);
    }
    updateTimeDisplay();
}

// Resize the map to fit its maximum extent
function resizeMap() {
    map.fitExtent(maxExtend, 0);
}