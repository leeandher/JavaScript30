

/*Query DOM Elements*/
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');

const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');

const playButton = player.querySelector('.toggle');
const fullscreenButton = player.querySelector('.fullscreen');

const sliders = player.querySelectorAll('.player__slider');

const skipButtons = player.querySelectorAll('[data-skip]');

/*Create operational functions*/
function togglePlay() {
  const status = video.paused ? 'play' : 'pause';
  video[status]();
}
function updateButton() {
  playButton.textContent = video.paused ? '❤️': '💋';
}

function adjustSlider(e) {
  const sliderSetting = e.target.name;
  video[sliderSetting] = e.target.value;
}

function displayTime(e) {
  const percentTime = (this.currentTime/this.duration)*100;
  progressBar.style.flexBasis = `${percentTime}%`;
}

function adjustCurrentTime(e) {
  const percentChange = e.offsetX/progress.offsetWidth;
  video.currentTime = video.duration*percentChange;
}

function skipTime(e) {
  const skipValue = this.dataset.skip;
  video.currentTime += parseFloat(skipValue);
}

function toggleFullscreen() {
  if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
  else if (video.mozRequestFullscreen) video.mozRequestFullscreen();
  else video.requestFullscreen();
}

let mousePressed = false;
player.addEventListener('mousedown', () => mousePressed = true);
player.addEventListener('mouseup', () => mousePressed = false);

/*Attach functions to DOM Elements*/
sliders.forEach(slider => {
  slider.addEventListener('change', adjustSlider)
  slider.addEventListener('mousemove', (e) => mousePressed && adjustSlider(e));
});

progress.addEventListener('click', adjustCurrentTime);
progress.addEventListener('mousemove', (e) => mousePressed && adjustCurrentTime(e));

skipButtons.forEach(skipButton => skipButton.addEventListener('click', skipTime));

playButton.addEventListener('click', togglePlay);
fullscreenButton.addEventListener('click', toggleFullscreen)

video.addEventListener('timeupdate', displayTime);
video.addEventListener('click',togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
