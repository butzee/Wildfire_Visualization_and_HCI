class TimelineButton {
  constructor(elementId, intervalFn) {
    this.elementId = elementId;
    this.intervalFn = intervalFn;
    this.timer = null;
    this.maxValue = 0;
    const button = document.getElementById(this.elementId);
    button.addEventListener('click', this.handleClick.bind(this));
  }

  handleClick() {
    clearInterval(this.timer);

    const slider = document.getElementById('rangeSlider');
    slider.value = 0;

    this.intervalFn();
    this.maxValue = +slider.max;

    this.timer = setInterval(() => {
      let value = +slider.value;
      slider.value = value + 1;

      if (value === this.maxValue) {
        clearInterval(this.timer);
      }
    }, 1000);
  }
}

/** Close dropdowns when clicking outside */
document.addEventListener('click', function(event) {
  for (const option of ['cause', 'size', 'year', 'speed']) {
    const dropdown = document.getElementById(option + "DropdownContent");
    const button = document.getElementById(option + "DropdownBtn");
    if (!button.contains(event.target) && !dropdown.contains(event.target) && dropdown.classList.contains("show-options")) {
      dropdown.classList.toggle("show-options");
    }
  }
});

function toggleDropdown(dropdown) {
  var dropdownContent = document.getElementById(dropdown + "DropdownContent");
  dropdownContent.classList.toggle("show-options");
}

function handleCheckboxChangeCause(checkbox) {
  var selectedCauses;
  var selectedCausesElement = document.getElementById("selectedCauses");
  var checkboxes = document.querySelectorAll('#causeDropdownContent input[type="checkbox"]');

  if (checkbox.value === "0") {
    checkboxes.forEach(function (cb) {
      if (cb !== checkbox) {
        cb.checked = false;
      }
    });
    selectedCauses = ["All sizes"];
  } else {
    var allCausesCheckbox = document.querySelector('#causeDropdownContent input[value="0"]');
    allCausesCheckbox.checked = false;
    selectedCauses = Array.from(document.querySelectorAll('#causeDropdownContent input[type="checkbox"]:checked')).map(function (checkbox) {
      return checkbox.value;
    });
  }

  selectedCausesElement.innerHTML = selectedCauses.map(function (cause) {
    return "<li>" + cause + "</li>";
  }).join("");
}

function handleCheckboxChangeSize(checkbox) {
  var selectedSizes;
  var selectedSizesElement = document.getElementById("selectedSizes");
  var checkboxes = document.querySelectorAll('#sizeDropdownContent input[type="checkbox"]');

  if (checkbox.value === "-1") {
    checkboxes.forEach(function (cb) {
      if (cb !== checkbox) {
        cb.checked = false;
      }
    });
    selectedSizes = ["All sizes"];
  } else {
    var allSizesCheckbox = document.querySelector('#sizeDropdownContent input[value="-1"]');
    allSizesCheckbox.checked = false;
    selectedSizes = Array.from(document.querySelectorAll('#sizeDropdownContent input[type="checkbox"]:checked')).map(function (checkbox) {
      return checkbox.value;
    });
  }

  selectedSizesElement.innerHTML = selectedSizes.map(function (size) {
    return "<li>" + size + "</li>";
  }).join("");
}

function handleCheckboxChangeYear(checkbox) {
  const checkboxes = document.querySelectorAll('#yearDropdownContent input[type="checkbox"]');
  checkboxes.forEach(cb => {
    if (cb !== checkbox) {
      cb.checked = false;
    }
  });
}

function handleCheckboxChangeSpeed(checkbox) {
  const checkboxes = document.querySelectorAll('#speedDropdownContent input[type="checkbox"]');
  checkboxes.forEach(cb => {
    if (cb !== checkbox) {
      cb.disabled = false;
      cb.checked = false;
    }
  });
  checkbox.disabled = true;
  checkbox.removeAttribute('style');
  if (document.getElementById('rangeSlider').value > 0) {
    d3.select("#pause").on("click")();
    d3.select("#start").on("click")();
  }
}

function getDate(day, year) {
  let date = new Date(year, 0);
  date.setDate(day);
  let options = { day: 'numeric', month: 'numeric', year: 'numeric' };
  let string = date.toLocaleDateString('de-DE', options);
  return string;
}

const updateYearDisplay = () => {
  let text;
  if (document.getElementById("yearCheckbox").checked) {
    text = "Current year: " + String(Number(document.getElementById('rangeSlider').value) + 1992);
  } else {
    const checkboxes = document.querySelectorAll('#yearDropdownContent input[type="checkbox"]');
    let year;
    checkboxes.forEach(cb => {
        if (cb.checked) {
            year = cb.value;
        }
    });
    text = "Current date: " + getDate(Number(document.getElementById('rangeSlider').value) + 1, year);
    
  }
  document.getElementById("current-year").innerText = text;
};

function timelineYearly() {
  clearInterval(myTimer);
  let b = d3.select("#rangeSlider");
  b.property("min", 0)
  b.property("max", 30)
  let maxValue = +b.property("max");
  myTimer = setInterval(function () {
    let value = +b.property("value");
    b.property("value", value + 1);
    updateYearDisplay();
    if (value === maxValue) {
      clearInterval(myTimer);
    }
  }, 1500);
}

function timelineYear() {
  // Zeitleiste im täglichen Modus
  clearInterval(myTimer);
  let b = d3.select("#rangeSlider");
  b.property("min", 1)
  b.property("max", 365) // Slider geht über jeden Tag des Jahres
  let maxValue = +b.property("max");
  myTimer = setInterval(function () {
    let value = +b.property("value");
    b.property("value", value + 1);
    if (value === maxValue) {
      clearInterval(myTimer);
    }
  }, 1000);
}

d3.select("#stop").on("click", function () {
  d3.select("#rangeSlider").property("value", 0);
  updateYearDisplay();
  clearInterval(myTimer)
});