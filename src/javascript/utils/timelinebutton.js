// Represents a timeline button that controls the animation of a timeline slider
class TimelineButton {
    /**
     * Constructs a new TimelineButton instance.
     * @param {string} elementId - The ID of the button element.
     * @param {Function} intervalFn - The function to be executed at each interval of the animation.
     */
    constructor(elementId, intervalFn) {
        this.elementId = elementId;
        this.intervalFn = intervalFn;
        this.timer = null;
        this.maxValue = 0;

        // Add a click event listener to the button
        const button = document.getElementById(this.elementId);
        button.addEventListener('click', this.handleClick.bind(this));
    }

    /**
     * Handles the click event of the button.
     */
    handleClick() {
        clearInterval(this.timer);

        // Reset the slider value to the initial position
        const slider = document.getElementById('rangeSlider');
        slider.value = 0;

        // Execute the interval function to initialize the animation
        this.intervalFn();
        this.maxValue = +slider.max;

        // Start the animation timer
        this.timer = setInterval(() => {
            let value = +slider.value;
            slider.value = value + 1;

            // Check if the slider value reaches the maximum value
            if (value === this.maxValue) {
                clearInterval(this.timer);
            }
        }, 1500 / timefactor); // Set the interval duration based on the 'timefactor' variable
    }
}
