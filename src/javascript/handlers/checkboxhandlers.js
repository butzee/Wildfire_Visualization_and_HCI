function handleCheckboxChangeVariant1(checkbox, checkboxes, allCheckbox) {
    // Handle the checkbox change event
    if (checkbox.value === "-1") {
        // If "All" checkbox is selected, uncheck other checkboxes
        checkboxes.forEach(function (cb) {
            if (cb !== checkbox) {
                cb.checked = false;
            }
        });
        allCheckbox.checked = true;
    } else {
        // If any specific checkbox is selected, update the "All" checkbox state
        if (!anyCheckboxOptionSelected(checkboxes)) {
            allCheckbox.checked = true;
        } else {
            allCheckbox.checked = false;
        }
    }
}

function handleCheckboxChangeCause(checkbox) {
    // Handle the checkbox change event for cause checkboxes
    var checkboxes = document.querySelectorAll('#causeDropdownContent input[type="checkbox"]');
    let allCausesCheckbox = document.querySelector('#causeDropdownContent input[value="-1"]');
    handleCheckboxChangeVariant1(checkbox, checkboxes, allCausesCheckbox);
}

function handleCheckboxChangeSize(checkbox) {
    // Handle the checkbox change event for size checkboxes
    var checkboxes = document.querySelectorAll('#sizeDropdownContent input[type="checkbox"]');
    var allSizesCheckbox = document.querySelector('#sizeDropdownContent input[value="-1"]');
    handleCheckboxChangeVariant1(checkbox, checkboxes, allSizesCheckbox);
}

function handleCheckboxChangeYear(checkbox) {
    // Handle the checkbox change event for year checkboxes
    const checkboxes = document.querySelectorAll('#yearDropdownContent input[type="checkbox"]');
    var allYearsCheckbox = document.querySelector('#yearDropdownContent input[value="-1"]');
    checkboxes.forEach(cb => {
        if (cb !== checkbox) {
            cb.checked = false;
        }
    });
    if (!anyCheckboxOptionSelected(checkboxes)) {
        allYearsCheckbox.checked = true;
    }
}

function handleCheckboxChangeVariant2(checkbox, checkboxes, normalCheckbox) {
    // Handle the checkbox change event for variant 2 checkboxes
    checkboxes.forEach(cb => {
        if (cb !== checkbox) {
            cb.checked = false;
        }
    });
    if (!anyCheckboxOptionSelected(checkboxes)) {
        normalCheckbox.checked = true;
    }
    // Trigger necessary events
    d3.select("#updateScatterHelper").on("click")();
    d3.select("#start_pause").on("click")();
    d3.select("#start_pause").on("click")();
}

function handleCheckboxChangeSpeed(checkbox) {
    // Handle the checkbox change event for speed checkboxes
    const checkboxes = document.querySelectorAll('#speedDropdownContent input[type="checkbox"]');
    const normalSpeedCheckbox = document.querySelector('#speedDropdownContent input[value="1"]');
    handleCheckboxChangeVariant2(checkbox, checkboxes, normalSpeedCheckbox);
}

function handleCheckboxChangeDisplaySize(checkbox) {
    // Handle the checkbox change event for display size checkboxes
    const checkboxes = document.querySelectorAll('#displaySizeDropdownContent input[type="checkbox"]');
    const normalSizeCheckbox = document.querySelector('#displaySizeDropdownContent input[value="1"]');
    handleCheckboxChangeVariant2(checkbox, checkboxes, normalSizeCheckbox);
}