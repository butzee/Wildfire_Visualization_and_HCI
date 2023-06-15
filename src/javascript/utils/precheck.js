// Listen for the DOMContentLoaded event, which indicates that the initial HTML document has been completely loaded and parsed
document.addEventListener("DOMContentLoaded", function () {
    // Set the checked property of the causeCheckbox element to true
    document.getElementById("causeCheckbox").checked = true;

    // Set the checked property of the sizeCheckbox element to true
    document.getElementById("sizeCheckbox").checked = true;

    // Set the checked property of the yearCheckbox element to true
    document.getElementById("yearCheckbox").checked = true;

    // Set the checked property of the defaultSizeOption element to true
    document.getElementById("defaultSizeOption").checked = true;

    // Set the checked property of the defaultSpeedOption element to true
    document.getElementById("defaultSpeedOption").checked = true;

    // Get all elements with the specified CSS selectors into a NodeList
    const elementsToFadeIn = document.querySelectorAll("#map, #map-controls, #bottombar, .topbar");
    // Loop through each element in the NodeList
    elementsToFadeIn.forEach((element) => {
        // Set the opacity style property of each element to '1' to make them visible
        element.style.opacity = '1';
    });
});
