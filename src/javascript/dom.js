const buttonSQL = document.getElementById('queryButton');
const slider = document.getElementById('rangeSlider');
const startPauseButton = d3.select("#start_pause");
const stopButton = d3.select("#stop");
const updateScatterHelperButton = d3.select("#updateScatterHelper");

let yearsArray;
let isDragging = false;
let myTimer;

buttonSQL.addEventListener('click', async () => {
  stopButton.on("click")();
  const year = getSelectedValues('#yearDropdownContent input[type="checkbox"]');
  const causeOptions = getSelectedValues('#causeDropdownContent input[type="checkbox"]');
  const sizeOptions = getSelectedValues('#sizeDropdownContent input[type="checkbox"]');
  var button = document.getElementById("displayType");
  if (button.classList.contains('disabled')) {
    button.classList.remove('disabled');
    button.style.color = "white";
  }
  try {
    showLoadingAnimation();
    yearsArray = await window.electronAPI.getFires(year, causeOptions, sizeOptions);
    showLoadingAnimation();
    d3.select("#rangeSlider")
     .property("min", 0)
     .property("max", areAllYearsDisplayed() ? 28 : 365);
  } catch (error) {
    console.error(error);
  }
  scatter ? updateScatter(0) : updateCluster(0);
  updateTimeDisplay();
});

slider.addEventListener('mousedown', () => isDragging = true);
slider.addEventListener('mouseup', () => isDragging = false);
slider.addEventListener('change', handleSliderChange);
slider.addEventListener('input', handleSliderChange);

startPauseButton.on("click", () => {
    if (!isAnimating()) {
        const b = d3.select("#rangeSlider");
        const maxValue = +b.property("max");
        if (+b.property("value") === maxValue) {
          b.property("value", 0);
          updateTimeDisplay();
        }
        play();
      } else {
        pause();
      }
      displayNextAnimationState(isAnimating() ? "play_arrow" : "pause");
});

stopButton.on("click", () => {
  d3.select("#rangeSlider").property("value", 0);
  updateYearDisplay();
  clearInterval(myTimer);
  document.getElementById("start_pause").firstElementChild.innerHTML = "play_arrow";  
  scatter ? updateScatter(0) : updateCluster(0);
  updateTimeDisplay();
});

updateScatterHelperButton.on("click", () => {
  scatter ? updateScatter(document.getElementById('rangeSlider').value) : updateCluster(document.getElementById('rangeSlider').value);
});

// Utility Functions
function getSelectedValues(selector) {
  return Array.from(document.querySelectorAll(`${selector}:checked`),  checkbox => checkbox.value);
}

function areAllYearsDisplayed() {
  return getSelectedValues('#yearDropdownContent input[type="checkbox"]')[0] === "-1";
}

function showLoadingAnimation() {
  document.getElementById("load").classList.toggle("show-options");
}

function getDate(day, year) {
  console.log("TEST")
  console.log(day, year)
  const date = new Date(year, 0);
  date.setDate(day);
  const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('de-DE', options);
}

function updateTimeDisplay() {
  if (document.getElementById("yearCheckbox").checked) {
    document.getElementById("current-year").innerText = "Current year: " + String(Number(document.getElementById('rangeSlider').value) + 1992);
  } else {
    const day = Number(document.getElementById('rangeSlider').value) + 1;
    const year = document.querySelector('#yearDropdownContent input[type="checkbox"]:checked').value
    document.getElementById("current-year").innerText = "Current date: " + getDate(day, year);
  }
}

function isAnimating() {
  const button = document.getElementById("start_pause");
  return button.firstElementChild.innerHTML === "pause";
}

function displayNextAnimationState(state) {
  const button = document.getElementById("start_pause");
  button.firstElementChild.innerHTML = state;
}

function play() {
  clearInterval(myTimer);
  const b = d3.select("#rangeSlider");
  const maxValue = +b.property("max");
  const speed = Number(Array.from(document.querySelectorAll('#speedDropdownContent input[type="checkbox"]:checked'))[0].value);
  
  myTimer = setInterval(() => {
    const value = +b.property("value") + 1;
    updateTimeDisplay();
    scatter ? updateScatter(value) : updateCluster(value);
    if (value > maxValue) {
        clearInterval(myTimer);
        displayNextAnimationState("play_arrow");
    } else {
        b.property("value", value);
    }
  }, 1000 / speed);
}

function pause() {
  clearInterval(myTimer);
}

function handleSliderChange(event) {
  if (!isDragging) {
    const value = event.target.value;
    scatter ? updateScatter(value) : updateCluster(value);
  }
  updateTimeDisplay();
}

function toggleDropdown(event) {
  var dropdown = event.target.closest('.dropdown').querySelector('.dropdown-content');
  if (dropdown) {
    dropdown.classList.toggle('show');
  }
}

function hideDropdown(event) {
  var dropdown = event.target.closest('.dropdown').querySelector('.dropdown-content');
  if (dropdown) {
    dropdown.classList.remove('show');
  }
}
