let timeLeft = 0;
let isRunning = false;
let timerInterval = null;

const alarmAudio = document.getElementById("alarm-audio");

function getInputDurasi() {
  const workH = parseInt(document.getElementById("work-hours").value) || 0;
  const workM = parseInt(document.getElementById("work-minutes").value) || 0;
  return (workH * 3600) + (workM * 60);
}

function getBreakDurasi() {
  const breakH = parseInt(document.getElementById("break-hours").value) || 0;
  const breakM = parseInt(document.getElementById("break-minutes").value) || 0;
  return (breakH * 3600) + (breakM * 60);
}

function pad(num) {
  return num.toString().padStart(2, "0");
}

function updateTimerDisplay(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  document.getElementById("hour-display").textContent = pad(hrs);
  document.getElementById("minute-display").textContent = pad(mins);
  document.getElementById("second-display").textContent = pad(secs);
}

function showPopup(message, onlyOK = false, callback = null) {
  const popup = document.createElement("div");
  popup.className = "custom-popup";
  popup.innerHTML = `
    <div class="popup-content">
      <p>${message}</p>
      <div class="popup-buttons">
        <button id="popup-ok">OK</button>
        ${!onlyOK ? '<button id="popup-cancel">Batal</button>' : ''}
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById("popup-ok").onclick = () => {
    popup.remove();
    if (callback) callback(true);
  };
  if (!onlyOK) {
    document.getElementById("popup-cancel").onclick = () => {
      popup.remove();
      if (callback) callback(false);
    };
  }
}

function transitionToBreak() {
  alarmAudio.play();
  showPopup("⏰ Waktu kerja selesai. Mulai istirahat?", false, (confirm) => {
    if (confirm) {
      timeLeft = getBreakDurasi();
      document.getElementById("session-label").textContent = "Istirahat";
      updateTimerDisplay(timeLeft);
      document.getElementById("start").click();
    }
  });
}

document.getElementById("start").onclick = () => {
  if (isRunning) return;

  if (timeLeft === 0) {
    timeLeft = getInputDurasi();
    document.getElementById("session-label").textContent = "Sesi Kerja";
  }

  if (timeLeft === 0) {
    showPopup("Masukkan waktu terlebih dahulu!", true);
    return;
  }

  isRunning = true;
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay(timeLeft);
    } else {
      clearInterval(timerInterval);
      isRunning = false;
      transitionToBreak();
    }
  }, 1000);
};

document.getElementById("pause").onclick = () => {
  clearInterval(timerInterval);
  isRunning = false;
};

document.getElementById("reset").onclick = () => {
  clearInterval(timerInterval);
  isRunning = false;
  timeLeft = getInputDurasi();
  document.getElementById("session-label").textContent = "Sesi Kerja";
  updateTimerDisplay(timeLeft);
};

updateTimerDisplay(0);
