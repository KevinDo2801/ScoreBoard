const minuteElementReal = parseInt(document.querySelector('.minute').innerText);
const secondElementReal =parseInt(document.querySelector('.second').innerText);

const state = {
  scores: { home: 0, guest: 0 },
  fouls: { home: 0, guest: 0 },
  period: 0,
  timeLeft: minuteElementReal * 60 + secondElementReal,
  timer: null,
};

function updateElementText(selector, text) {
  document.querySelector(selector).textContent = text;
}


function updateScore(team) {
  updateElementText(`[data-score="${team}"]`, state.scores[team]);
}

function updateFoul(team) {
  updateElementText(`[data-foul="${team}"]`, state.fouls[team]);
}

function updatePeriod() {
  updateElementText('.period p', state.period);
}

function updateTimer() {
  const minutes = Math.floor(state.timeLeft / 60).toString().padStart(2, '0');
  const seconds = (state.timeLeft % 60).toString().padStart(2, '0');
  updateElementText('.minute', minutes);
  updateElementText('.second', seconds);
}

function updateScoreOnClick(event) {
  const value = parseInt(event.target.dataset.value);
  const team = event.target.dataset.team;
  state.scores[team] += value;
  updateScore(team);
}

function timerCountDown() {
  state.timer = setInterval(() => {
    state.timeLeft--;
    updateTimer();

    if (state.timeLeft < 0) {
      clearInterval(state.timer);
      flashTimer();
    }
  }, 1000);
}

function flashTimer() {
  let visible = true;
  const minuteElement = document.querySelector('.minute');
  minuteElement.textContent = "00";
  const secondElement = document.querySelector('.second');
  secondElement.textContent = "00";
  const flash = setInterval(() => {
    visible = !visible;
    minuteElement.style.display = visible ? 'block' : 'none';
    secondElement.style.display = visible ? 'block' : 'none';
  }, 500);

  setTimeout(() => {
    clearInterval(flash);
    state.period++;
    state.timeLeft = minuteElementReal * 60 + secondElementReal;
    updatePeriod();
    updateTimer();
  }, 3000);
}

function timerPauseCountDown() {
  clearInterval(state.timer);
}

function updateFoulOnClick(event) {
  const team = event.target.dataset.foul;
  state.fouls[team]++;
  updateFoul(team);
}

function newGame() {
  state.scores.home = state.scores.guest = 0;
  state.fouls.home = state.fouls.guest = 0;
  state.period = 0;
  state.timeLeft = minuteElementReal * 60 + secondElementReal;

  updateScore('home');
  updateScore('guest');
  updateFoul('home');
  updateFoul('guest');
  updatePeriod();
  updateTimer();

  clearInterval(state.timer);
}

document.querySelectorAll('.plus').forEach(button => button.addEventListener('click', updateScoreOnClick));
document.querySelectorAll('.foul p').forEach(p => p.addEventListener('click', updateFoulOnClick));
document.querySelector('#play').addEventListener('click', timerCountDown);
document.querySelector('#pause').addEventListener('click', timerPauseCountDown);
document.querySelector('#new').addEventListener('click', newGame);
