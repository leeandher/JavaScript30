let countdown;

const page = document.querySelector("html");
const timerDisplay = document.querySelector(".display__time-left");
const endDisplay = document.querySelector(".display__end-time");
const buttons = document.querySelectorAll("[data-time]");

const normalBg = `linear-gradient(45deg, #cc2b5e 0%, #753a88 100%)`;
const finishedBg = `linear-gradient(45deg, #02aab0 0%, #00cdac 100%)`;

function timer(seconds) {
  //Clear existing timers
  clearInterval(countdown);
  page.style.background = normalBg;

  const now = Date.now();
  const then = now + seconds * 1000;
  //Show the first second start
  displayTimeLeft(seconds);
  displayEndTime(then);
  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    if (secondsLeft === 0) {
      page.style.background = finishedBg;
      endDisplay.textContent = `Time's up! Hope you're back!`;
    }
    //Check if the timer is up
    if (secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }
    //Display the time
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(secondsLeft) {
  //Calculate
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const adjustedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const adjustedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  const display = `${adjustedMinutes}:${adjustedSeconds}`;
  //Display
  timerDisplay.textContent = display;
  document.title = display;
}

function displayEndTime(timestamp) {
  //Calculate
  const d = new Date(timestamp);
  const hour = d.getHours();
  const adjustedHour = hour < 12 ? hour : hour - 12;
  const minute = d.getMinutes();
  const adjustedMinute = minute < 10 ? `0${minute}` : minute;
  const timePeriod = hour < 12 ? "AM" : "PM";
  //Display
  endDisplay.textContent = `Be back at ${adjustedHour}:${adjustedMinute} ${timePeriod}`;
}

buttons.forEach(button =>
  button.addEventListener("click", function() {
    timer(this.dataset.time);
  })
);

document.customForm.addEventListener("submit", function(e) {
  e.preventDefault();
  timer(this.minutes.value * 60);
});
