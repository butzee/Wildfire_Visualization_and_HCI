// Define a custom control class called DateDisplay that extends maptalks.control.Control
class DateDisplay extends maptalks.control.Control {
    // Override the buildOn method to create and return the control element
    buildOn() {
        // Create a div element using maptalks.DomUtil.createEl
        const div = maptalks.DomUtil.createEl("div");

        // Set the id of the div element to "current-year"
        div.id = "current-year";

        // Set the initial innerHTML of the div element to "Current year: 1992"
        div.innerHTML = "Current year: 1992";

        // Return the created div element
        return div;
    }
}

// Merge additional options for the DateDisplay control
DateDisplay.mergeOptions({
    position: 'top-left', // Set the default position of the control to "top-left"
});