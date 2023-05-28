class TimelineButton {
  constructor(elementId, intervalFn) {
    // Konstruktor für die Timeline-Schaltfläche
    this.elementId = elementId;
    this.intervalFn = intervalFn;
    this.timer = null;
    this.maxValue = 0;

    // Event Listener für den Klick auf die Schaltfläche
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

function showYear(selectedYear) {
  // Zeigt das ausgewählte Jahr an
  var selectedYearElement = document.getElementById("selectedYear");
  if (selectedYear === "-1") {
    selectedYearElement.textContent = "All years";
  } else {
    selectedYearElement.textContent = selectedYear;
  }

  document.querySelector('.dropdown-year').value = selectedYear;
  toggleDropdown('year');
}

function toggleDropdown(dropdown) {
  // Öffnet oder schließt das Dropdown-Menü
  var dropdownContent = document.getElementById(dropdown + "DropdownContent");
  dropdownContent.classList.toggle("show-options");
}

function handleCheckboxChangeCause(checkbox) {
  // Behandelt die Änderung der Ursache-Checkboxen
  var selectedCausesElement = document.getElementById("selectedCauses");
  var checkboxes = document.querySelectorAll('#causeDropdownContent input[type="checkbox"]');

  if (checkbox.value === "0") {
    // Wenn die "All causes" Checkbox ausgewählt ist, werden alle anderen Checkboxen abgewählt
    checkboxes.forEach(function (cb) {
      if (cb !== checkbox) {
        cb.checked = false;
      }
    });
  } else {
    // Wenn eine andere Checkbox ausgewählt ist, wird die "All causes" Checkbox abgewählt
    var allCausesCheckbox = document.querySelector('#causeDropdownContent input[value="0"]');
    allCausesCheckbox.checked = false;
  }

  var selectedCauses = Array.from(document.querySelectorAll('#causeDropdownContent input[type="checkbox"]:checked')).map(function (checkbox) {
    return checkbox.value;
  });
  selectedCausesElement.innerHTML = selectedCauses.map(function (cause) {
    return "<li>" + cause + "</li>";
  }).join("");
}

function handleCheckboxChangeSize(checkbox) {
  // Behandelt die Änderung der Größen-Checkboxen
  var selectedSizesElement = document.getElementById("selectedSizes");
  var checkboxes = document.querySelectorAll('#sizeDropdownContent input[type="checkbox"]');

  if (checkbox.value === "-1") {
    // Wenn die "All sizes" Checkbox ausgewählt ist, werden alle anderen Checkboxen abgewählt
    checkboxes.forEach(function (cb) {
      if (cb !== checkbox) {
        cb.checked = false;
      }
    });
  } else {
    // Wenn eine andere Checkbox ausgewählt ist, wird die "All sizes" Checkbox abgewählt
    var allSizesCheckbox = document.querySelector('#sizeDropdownContent input[value="-1"]');
    allSizesCheckbox.checked = false;
  }

  var selectedSizes = Array.from(document.querySelectorAll('#sizeDropdownContent input[type="checkbox"]:checked')).map(function (checkbox) {
    return checkbox.value;
  });
  selectedSizesElement.innerHTML = selectedSizes.map(function (size) {
    return "<li>" + size + "</li>";
  }).join("");
}


const updateYearDisplay = () => {
  // Aktualisiert die Anzeige des aktuellen Jahres
  document.getElementById("current-year").innerText = "Current year " +
    String(Number(document.getElementById('rangeSlider').value) + 1992);
};



function timelineYearly() {
  // Zeitleiste im jährlichen Modus
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

function showYear(selectedYear) {
  if (selectedYear === "-1") {
    year = -1
    d3.select("#start").on("click", timelineYearly);
    d3.select("#rangeSlider").property("value", 0);
    updateYearDisplay();
    clearInterval(myTimer);
  } else {
    year = Number(selectedYear)
    d3.select("#start").on("click", timelineYear);
    d3.select("#rangeSlider").property("value", 0);
    document.getElementById("current-year").innerText = "Current year " + year + 1992;
    clearInterval(myTimer);
  }
}