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

class ResizeButton extends maptalks.control.Control {
  buildOn(map) {
    var dom = maptalks.DomUtil.createEl("button");
    dom.className = "btn-controls";
    dom.onclick = fit_to_extend;
    var span = maptalks.DomUtil.createEl("span");
    span.className = "material-symbols-rounded";
    span.textContent = "resize";
    dom.appendChild(span);
    return dom;
  }
}

function showYear(selectedYear) {
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
  var dropdownContent = document.getElementById(dropdown + "DropdownContent");
  dropdownContent.classList.toggle("show-options");
}

function handleCheckboxChangeCause(checkbox) {
  var selectedCausesElement = document.getElementById("selectedCauses");
  var checkboxes = document.querySelectorAll('#causeDropdownContent input[type="checkbox"]');

  if (checkbox.value === "0") {
      // If "All causes" checkbox is checked, uncheck all other checkboxes
      checkboxes.forEach(function (cb) {
      if (cb !== checkbox) {
          cb.checked = false;
      }
      });
  } else {
      // If any other checkbox is checked, uncheck the "All causes" checkbox
      var allCausesCheckbox = document.querySelector('#causeDropdownContent input[value="0"]');
      allCausesCheckbox.checked = false;
  }

  var selectedCauses = Array.from(document.querySelectorAll('#causeDropdownContent input[type="checkbox"]:checked')).map(function(checkbox) {
      return checkbox.value;
  });
  selectedCausesElement.innerHTML = selectedCauses.map(function(cause) {
      return "<li>" + cause + "</li>";
  }).join("");
  // get Current Slider Value
  fetchAndUpdate(document.getElementById("rangeSlider").value);
}

function handleCheckboxChangeSize(checkbox) {
  var selectedSizesElement = document.getElementById("selectedSizes");
  var checkboxes = document.querySelectorAll('#sizeDropdownContent input[type="checkbox"]');

  if (checkbox.value === "-1") {
      // If "All sizes" checkbox is checked, uncheck all other checkboxes
      checkboxes.forEach(function (cb) {
      if (cb !== checkbox) {
          cb.checked = false;
      }
      });
  } else {
      // If any other checkbox is checked, uncheck the "All sizes" checkbox
      var allSizesCheckbox = document.querySelector('#sizeDropdownContent input[value="-1"]');
      allSizesCheckbox.checked = false;
  }

  var selectedSizes = Array.from(document.querySelectorAll('#sizeDropdownContent input[type="checkbox"]:checked')).map(function(checkbox) {
      return checkbox.value;
  });
  selectedSizesElement.innerHTML = selectedSizes.map(function(size) {
      return "<li>" + size + "</li>";
  }).join("");
  fetchAndUpdate(document.getElementById("rangeSlider").value);
}
let myTimer;

const updateYearDisplay = () => {
      document.getElementById("current-year").innerText = "Current year "+
          String(Number(document.getElementById('rangeSlider').value)+1992);
};

// Listen for the 'input' event on the slider
d3.select('#rangeSlider').on('input', function() {
  updateYearDisplay();
  fetchAndUpdate(Number(this.value));
});

function timelineYearly() {
  clearInterval(myTimer);
  let b= d3.select("#rangeSlider");
  b.property("min", 0)
  b.property("max", 30)
  let maxValue = +b.property("max");
  myTimer = setInterval (function() {
      let value = +b.property("value");
      b.property("value", value + 1);
      updateYearDisplay();
      fetchAndUpdate(+b.property("value"));
      if (value === maxValue) {
          clearInterval(myTimer);
      }
  }, 1500);
}

function timelineYear() {
  clearInterval(myTimer);
  let b= d3.select("#rangeSlider");
  b.property("min", 1)
  b.property("max", 365) // Slider goes over every day of the year
  let maxValue = +b.property("max");
  myTimer = setInterval (function() {
      let value = +b.property("value");
      b.property("value", value + 1);
      fetchAndUpdate(+b.property("value"));
      if (value === maxValue) {
          clearInterval(myTimer);
      }
  }, 1000);
}

d3.select("#start").on("click", timelineYearly);
d3.select("#pause").on("click", function() {
  clearInterval (myTimer);
});

d3.select("#stop").on("click", function() {
      d3.select("#rangeSlider").property("value", 0);
      updateYearDisplay();
      clearInterval (myTimer)
      fetchAndUpdate(0);
});

function filterBy() {
    fetchAndUpdate(parseInt(document.getElementById('rangeSlider').value));
}

function showYear(selectedYear) {
    if (selectedYear === "-1") {
        year = -1
        d3.select("#start").on("click", timelineYearly);
        d3.select("#rangeSlider").property("value", 0);
        updateYearDisplay();
        clearInterval(myTimer);
        fetchAndUpdate(0);
    } else {
        year = Number(selectedYear)
        d3.select("#start").on("click", timelineYear);
        d3.select("#rangeSlider").property("value", 0);
        document.getElementById("current-year").innerText ="Current year "+ year+1992;
        clearInterval(myTimer);
        fetchAndUpdate(0);
    }
}