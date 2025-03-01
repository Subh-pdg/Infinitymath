// ================================
// Global Variables and Tracking
// ================================
let totalSumsCount = 0;
let correctCount = 0;
let wrongCount = 0;
let difficultyLevel = 1; // 1 = easy, 2 = medium, 3 = hard
let currentQuestion = null;
let timer;
let timeLeft = 0;
let maxTimeForCurrentQuestion = 0;  // For visual timer progress
let warningCount = 0;
let warningActive = false;
let isAnswerSubmitted = false;
let questionStartTime = null;
let historyRecords = [];
let warningsHistory = [];
let includeMulDiv = false;
let lastWarningTime = 0;
window.chartStats = null;
let questionChart = null;
let sessionReportChart = null;
let sessionReports = JSON.parse(localStorage.getItem('sessionReports')) || [];

// ================================
// DOM Elements
// ================================
const questionElement = document.getElementById('question');
const answerElement = document.getElementById('answer');
const submitBtn = document.getElementById('submitBtn');
const feedbackElement = document.getElementById('feedback');
const explanationElement = document.getElementById('explanation');
const nextBtn = document.getElementById('nextBtn');
const timeLeftElement = document.getElementById('timeLeft');
const scorecardBtn = document.getElementById('scorecardBtn');
const scorecardModal = document.getElementById('scorecardModal');
const closeModal = document.getElementById('closeModal');
const totalSumsElement = document.getElementById('totalSums');
const correctAnswersElement = document.getElementById('correctAnswers');
const wrongAnswersElement = document.getElementById('wrongAnswers');
const dateElement = document.getElementById('date');
const toggleMulDivElement = document.getElementById('toggleMulDiv');
const historyBtn = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
const closeHistoryModal = document.getElementById('closeHistoryModal');
const passwordModal = document.getElementById('passwordModal');
const passwordInput = document.getElementById('passwordInput');
const passwordSubmitBtn = document.getElementById('passwordSubmitBtn');
const closePasswordModal = document.getElementById('closePasswordModal');
const passwordError = document.getElementById('passwordError');
const showWarningsBtn = document.getElementById('showWarningsBtn');
const warningsList = document.getElementById('warningsList');
const downloadReportBtn = document.getElementById('downloadReportBtn');
const endSessionBtn = document.getElementById('endSessionBtn');
const notificationContainer = document.getElementById('notificationContainer');
// New elements for delete records functionality
const deleteRecordsBtn = document.getElementById('deleteRecordsBtn');
const deleteRecordsModal = document.getElementById('deleteRecordsModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const closeDeleteModal = document.getElementById('closeDeleteModal');

// To track modal state
let intendedModal = "";

// ================================
// Custom Notification Function
// ================================
function showNotification(message, type = "info", duration = 3000) {
  const notif = document.createElement('div');
  notif.className = `notification ${type}`;
  notif.textContent = message;
  notificationContainer.appendChild(notif);
  setTimeout(() => {
    notif.remove();
  }, duration);
}

// ================================
// Navigation-Away Warning Functions
// ================================
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    handleNavigationAway();
  }
});
window.addEventListener('blur', () => {
  handleNavigationAway();
});
function handleNavigationAway() {
  const now = Date.now();
  if (now - lastWarningTime < 1000) return;
  lastWarningTime = now;
  warningCount++;
  const currentTime = new Date().toLocaleTimeString();
  const message = `Warning ${warningCount}: Do not leave the page!`;
  warningsHistory.push({ message, time: currentTime });
  showWarningPopup(message, currentTime);
  if (timeLeft > 0 && !warningActive && !isAnswerSubmitted) {
    submitAnswer();
  }
  if (warningCount >= 5) {
    showStrongWarningPopup();
  }
}
function showWarningPopup(message, timeStamp) {
  const popup = document.createElement('div');
  popup.className = 'warning-popup';
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.padding = '20px';
  popup.style.backgroundColor = '#ffdddd';
  popup.style.border = '2px solid #ff0000';
  popup.style.zIndex = 1000;
  popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
  popup.innerHTML = `<h2>${message}</h2><p>Time: ${timeStamp}</p>`;
  document.body.appendChild(popup);
  setTimeout(() => { popup.remove(); }, 3000);
}
function showStrongWarningPopup() {
  const popup = document.createElement('div');
  popup.className = 'strong-warning-popup';
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.padding = '30px';
  popup.style.backgroundColor = '#ffeeee';
  popup.style.border = '3px solid #ff0000';
  popup.style.zIndex = 1001;
  popup.style.boxShadow = '0 0 15px rgba(0,0,0,0.7)';
  popup.innerHTML = `<h2>DO NOT GO TO A DIFFERENT PAGE. PRACTICE THE MATH!</h2>`;
  document.body.appendChild(popup);
  setTimeout(() => { popup.remove(); }, 7000);
}

// ================================
// Scorecard Functions
// ================================
function resetScorecard() {
  totalSumsCount = 0;
  correctCount = 0;
  wrongCount = 0;
  difficultyLevel = 1;
  updateScorecard();
}
function updateScorecard() {
  totalSumsElement.textContent = totalSumsCount;
  correctAnswersElement.textContent = correctCount;
  wrongAnswersElement.textContent = wrongCount;
  dateElement.textContent = new Date().toLocaleDateString();
}

// ================================
// Question Generation and Timer
// ================================
function generateQuestion() {
  let maxNumber;
  if (difficultyLevel === 1) maxNumber = 20;
  else if (difficultyLevel === 2) maxNumber = 50;
  else maxNumber = 100;

  let operator;
  if (includeMulDiv) {
    const operators = ['+', '-', '*', '/'];
    operator = operators[Math.floor(Math.random() * operators.length)];
  } else {
    operator = Math.random() < 0.5 ? '+' : '-';
  }

  let num1, num2;
  if (operator === '+') {
    num1 = Math.floor(Math.random() * maxNumber) + 1;
    num2 = Math.floor(Math.random() * maxNumber) + 1;
  } else if (operator === '-') {
    do {
      num1 = Math.floor(Math.random() * maxNumber) + 1;
      num2 = Math.floor(Math.random() * maxNumber) + 1;
    } while (num1 < num2);
  } else if (operator === '*') {
    let multMax = difficultyLevel === 1 ? 10 : difficultyLevel === 2 ? 20 : 50;
    num1 = Math.floor(Math.random() * multMax) + 1;
    num2 = Math.floor(Math.random() * multMax) + 1;
  } else if (operator === '/') {
    let divMax = difficultyLevel === 1 ? 10 : difficultyLevel === 2 ? 20 : 50;
    num2 = Math.floor(Math.random() * (divMax - 1)) + 2;
    const quotient = Math.floor(Math.random() * divMax) + 1;
    num1 = num2 * quotient;
  }

  currentQuestion = { num1, num2, operator };
  const displayOperator = operator === '/' ? '÷' : operator === '*' ? '×' : operator;
  questionElement.textContent = `${num1} ${displayOperator} ${num2}`;

  // Set timer based on difficulty and store max time for progress bar
  timeLeft = (difficultyLevel === 1) ? 10 : (difficultyLevel === 2 ? 15 : 20);
  maxTimeForCurrentQuestion = timeLeft;
  timeLeftElement.textContent = timeLeft;
  document.getElementById('timerProgress').style.width = "100%";
  questionStartTime = new Date();
  if (timer) clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
}
function updateTimer() {
  if (timeLeft <= 0) {
    clearInterval(timer);
    submitAnswer();
  } else {
    timeLeft--;
    timeLeftElement.textContent = timeLeft;
    document.getElementById('timerProgress').style.width = ((timeLeft / maxTimeForCurrentQuestion) * 100) + '%';
  }
}

// ================================
// Interactive Explanation Functions
// ================================
function createExplanationStep(title, detail) {
  const container = document.createElement('div');
  container.className = 'explanation-step';
  const button = document.createElement('button');
  button.className = 'step-toggle';
  button.textContent = title;
  const detailDiv = document.createElement('div');
  detailDiv.className = 'step-detail';
  detailDiv.innerHTML = detail;
  button.addEventListener('click', function() {
    detailDiv.classList.toggle('active');
  });
  container.appendChild(button);
  container.appendChild(detailDiv);
  return container;
}
function generateInteractiveExplanationAddition(num1, num2, correctAnswer) {
  explanationElement.innerHTML = "";
  const step1 = createExplanationStep(`Step 1: Break Down Numbers`, `
    In <strong>${num1}</strong>: tens = ${Math.floor(num1/10)*10}, ones = ${num1 % 10}.<br>
    In <strong>${num2}</strong>: tens = ${Math.floor(num2/10)*10}, ones = ${num2 % 10}.
  `);
  const step2 = createExplanationStep(`Step 2: Add the Ones`, `
    ${num1 % 10} + ${num2 % 10} = ${ (num1 % 10) + (num2 % 10) }.
  `);
  const step3 = createExplanationStep(`Step 3: Add the Tens`, `
    ${Math.floor(num1/10)*10} + ${Math.floor(num2/10)*10} = ${ (Math.floor(num1/10)*10) + (Math.floor(num2/10)*10) }.
  `);
  const step4 = createExplanationStep(`Step 4: Combine Results`, `
    Total = ${correctAnswer}.
  `);
  explanationElement.appendChild(step1);
  explanationElement.appendChild(step2);
  explanationElement.appendChild(step3);
  explanationElement.appendChild(step4);
  explanationElement.classList.remove('hidden');
}
function generateInteractiveExplanationSubtraction(num1, num2, correctAnswer) {
  explanationElement.innerHTML = "";
  const step1 = createExplanationStep(`Step 1: Break Down Numbers`, `
    In <strong>${num1}</strong>: tens = ${Math.floor(num1/10)*10}, ones = ${num1 % 10}.<br>
    In <strong>${num2}</strong>: tens = ${Math.floor(num2/10)*10}, ones = ${num2 % 10}.
  `);
  const step2 = createExplanationStep(`Step 2: Subtract the Ones`, `
    ${num1 % 10} - ${num2 % 10} = ${ (num1 % 10) - (num2 % 10) }.
  `);
  const step3 = createExplanationStep(`Step 3: Subtract the Tens`, `
    ${Math.floor(num1/10)*10} - ${Math.floor(num2/10)*10} = ${ (Math.floor(num1/10)*10) - (Math.floor(num2/10)*10) }.
  `);
  const step4 = createExplanationStep(`Step 4: Combine Differences`, `
    Total = ${correctAnswer}.
  `);
  explanationElement.appendChild(step1);
  explanationElement.appendChild(step2);
  explanationElement.appendChild(step3);
  explanationElement.appendChild(step4);
  explanationElement.classList.remove('hidden');
}
function generateInteractiveExplanationMultiplication(num1, num2, correctAnswer) {
  explanationElement.innerHTML = "";
  const step1 = createExplanationStep(`Step 1: Multiply`, `
    ${num1} × ${num2} = ${correctAnswer}.
  `);
  const step2 = createExplanationStep(`Step 2: Understand as Repeated Addition`, `
    Adding ${num1} together ${num2} times equals ${correctAnswer}.
  `);
  explanationElement.appendChild(step1);
  explanationElement.appendChild(step2);
  explanationElement.classList.remove('hidden');
}
function generateInteractiveExplanationDivision(num1, num2, correctAnswer) {
  explanationElement.innerHTML = "";
  const step1 = createExplanationStep(`Step 1: Setup Division`, `
    ${num1} ÷ ${num2}.
  `);
  const step2 = createExplanationStep(`Step 2: Determine the Quotient`, `
    Since ${num2} × ${correctAnswer} = ${num1}, the quotient is ${correctAnswer}.
  `);
  explanationElement.appendChild(step1);
  explanationElement.appendChild(step2);
  explanationElement.classList.remove('hidden');
}
function generateExpandedExplanation(correctAnswer) {
  const { num1, num2, operator } = currentQuestion;
  if (operator === '+') generateInteractiveExplanationAddition(num1, num2, correctAnswer);
  else if (operator === '-') generateInteractiveExplanationSubtraction(num1, num2, correctAnswer);
  else if (operator === '*') generateInteractiveExplanationMultiplication(num1, num2, correctAnswer);
  else if (operator === '/') generateInteractiveExplanationDivision(num1, num2, correctAnswer);
}

// ================================
// Answer Submission and Explanation
// ================================
submitBtn.addEventListener('click', submitAnswer);
function submitAnswer() {
  clearInterval(timer);
  const userAnswer = parseInt(answerElement.value);
  let correctAnswer;
  const { num1, num2, operator } = currentQuestion;
  switch (operator) {
    case '+': correctAnswer = num1 + num2; break;
    case '-': correctAnswer = num1 - num2; break;
    case '*': correctAnswer = num1 * num2; break;
    case '/': correctAnswer = num1 / num2; break;
  }
  
  if (!isAnswerSubmitted) {
    totalSumsCount++;
    isAnswerSubmitted = true;
  }
  
  let result;
  if (userAnswer === correctAnswer) {
    correctCount++;
    feedbackElement.textContent = 'Great job!';
    feedbackElement.className = 'feedback correct';
    showNotification('Correct answer!', 'success');
    result = true;
  } else {
    wrongCount++;
    feedbackElement.textContent = 'Oops, that\'s not right!';
    feedbackElement.className = 'feedback wrong';
    showNotification('Wrong answer. Try the next one!', 'error');
    result = false;
  }
  
  generateExpandedExplanation(correctAnswer);
  
  const submissionTime = new Date();
  const timeTaken = Math.round((submissionTime - questionStartTime) / 1000);
  const record = {
    question: questionElement.textContent,
    correctAnswer: correctAnswer,
    userAnswer: userAnswer,
    explanation: explanationElement.innerHTML,
    timeTaken: `${timeTaken} seconds`,
    started: questionStartTime.toLocaleTimeString(),
    submitted: submissionTime.toLocaleTimeString()
  };
  historyRecords.push(record);
  
  updateDifficulty();
  updateScorecard();
  updateQuestionResponseChart();
  
  feedbackElement.classList.remove('hidden');
  submitBtn.classList.add('hidden');
  answerElement.setAttribute('readonly', true);
  const baseDelay = (difficultyLevel === 1) ? 3000 : (difficultyLevel === 2 ? 5000 : 7000);
  const delay = result ? baseDelay : baseDelay + 2000;
  nextBtn.disabled = true;
  nextBtn.classList.add('disabled');
  setTimeout(() => {
    nextBtn.disabled = false;
    nextBtn.classList.remove('disabled');
  }, delay);
  nextBtn.classList.remove('hidden');
}
function updateDifficulty() {
  const n = historyRecords.length;
  if (n >= 3) {
    const lastThree = historyRecords.slice(n - 3);
    const allCorrect = lastThree.every(rec => rec.userAnswer === rec.correctAnswer);
    const allWrong = lastThree.every(rec => rec.userAnswer !== rec.correctAnswer);
    if (allCorrect && difficultyLevel < 3) {
      difficultyLevel++;
      console.log('Difficulty increased to', difficultyLevel);
    } else if (allWrong && difficultyLevel > 1) {
      difficultyLevel--;
      console.log('Difficulty decreased to', difficultyLevel);
    }
  }
}

// ================================
// Next Question Handler
// ================================
nextBtn.addEventListener('click', () => {
  feedbackElement.classList.add('hidden');
  explanationElement.classList.add('hidden');
  answerElement.value = '';
  answerElement.removeAttribute('readonly');
  isAnswerSubmitted = false;
  generateQuestion();
  nextBtn.classList.add('hidden');
  submitBtn.classList.remove('hidden');
});

// ================================
// Helper: Format Explanation for History Modal
// ================================
function formatExplanationForHistory(explanationHTML) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = explanationHTML;
  // Remove interactive toggle buttons
  const toggles = tempDiv.querySelectorAll('.step-toggle');
  toggles.forEach(toggle => toggle.remove());
  // Force all detail sections to be visible
  const details = tempDiv.querySelectorAll('.step-detail');
  details.forEach(detail => {
    detail.style.display = 'block';
  });
  return tempDiv.innerHTML;
}

// ================================
// PASSWORD-PROTECTED MODALS
// ================================
scorecardBtn.addEventListener('click', () => {
  intendedModal = "scorecard";
  passwordInput.value = "";
  passwordError.textContent = "";
  passwordError.classList.add('hidden');
  passwordModal.style.display = 'block';
});
historyBtn.addEventListener('click', () => {
  intendedModal = "history";
  passwordInput.value = "";
  passwordError.textContent = "";
  passwordError.classList.add('hidden');
  passwordModal.style.display = 'block';
});
passwordSubmitBtn.addEventListener('click', () => {
  const pwd = passwordInput.value;
  if (pwd === "123454") {
    passwordModal.style.display = 'none';
    if (intendedModal === "scorecard") {
      updateScorecard();
      scorecardModal.style.display = 'block';
      updateStatisticsDashboard();
      updateSessionReportChart();
    } else if (intendedModal === "history") {
      const historyContent = document.getElementById('historyContent');
      historyContent.innerHTML = '';
      if (historyRecords.length === 0) {
        historyContent.innerHTML = '<p>No history available.</p>';
      } else {
        historyRecords.forEach(record => {
          const card = createHistoryCard(record);
          historyContent.appendChild(card);
        });
      }
      historyModal.style.display = 'block';
    }
  } else {
    passwordError.textContent = "Invalid password. Please try again.";
    passwordError.classList.remove('hidden');
  }
});
closePasswordModal.addEventListener('click', () => {
  passwordModal.style.display = 'none';
});
closeModal.addEventListener('click', () => {
  scorecardModal.style.display = 'none';
});
closeHistoryModal.addEventListener('click', () => {
  historyModal.style.display = 'none';
});

// ================================
// Delete Records Modal Event Handlers
// ================================
deleteRecordsBtn.addEventListener('click', () => {
  deleteRecordsModal.style.display = 'block';
});
cancelDeleteBtn.addEventListener('click', () => {
  deleteRecordsModal.style.display = 'none';
});
closeDeleteModal.addEventListener('click', () => {
  deleteRecordsModal.style.display = 'none';
});
confirmDeleteBtn.addEventListener('click', () => {
  // Clear all records
  historyRecords = [];
  sessionReports = [];
  warningsHistory = [];
  localStorage.removeItem('sessionReports');
  // Destroy charts if they exist
  if (questionChart) {
    questionChart.destroy();
    questionChart = null;
  }
  if (sessionReportChart) {
    sessionReportChart.destroy();
    sessionReportChart = null;
  }
  if (window.chartStats) {
    window.chartStats.destroy();
    window.chartStats = null;
  }
  updateScorecard();
  updateQuestionResponseChart();
  updateStatisticsDashboard();
  updateSessionReportChart();
  deleteRecordsModal.style.display = 'none';
  showNotification("All records have been deleted.", "success");
});

// ================================
// History Modal: Create Cards and TXT Download
// ================================
function createHistoryCard(record) {
  const card = document.createElement('div');
  card.classList.add('history-card');
  const isCorrectAnswer = record.userAnswer === record.correctAnswer;
  const resultText = isCorrectAnswer
    ? '<span style="color:green;">Correct</span>'
    : '<span style="color:red;">Wrong</span>';
  const summaryDiv = document.createElement('div');
  summaryDiv.classList.add('history-summary');
  summaryDiv.innerHTML = `
    <p><strong>Question:</strong> ${record.question}</p>
    <p><strong>Your Answer:</strong> ${record.userAnswer}</p>
    <p><strong>Result:</strong> ${resultText}</p>
  `;
  const detailsDiv = document.createElement('div');
  detailsDiv.classList.add('history-details', 'hidden');
  detailsDiv.innerHTML = `
    <p><strong>Correct Answer:</strong> ${record.correctAnswer}</p>
    <p><strong>Explanation:</strong> ${formatExplanationForHistory(record.explanation)}</p>
    <p><strong>Time Taken:</strong> ${record.timeTaken}</p>
    <p><strong>Start Time:</strong> ${record.started}</p>
    <p><strong>End Time:</strong> ${record.submitted}</p>
  `;
  const toggleBtn = document.createElement('button');
  toggleBtn.classList.add('show-more-btn');
  toggleBtn.textContent = 'Show More';
  toggleBtn.addEventListener('click', () => {
    if (detailsDiv.classList.contains('hidden')) {
      detailsDiv.classList.remove('hidden');
      toggleBtn.textContent = 'Show Less';
    } else {
      detailsDiv.classList.add('hidden');
      toggleBtn.textContent = 'Show More';
    }
  });
  const downloadBtn = document.createElement('button');
  downloadBtn.classList.add('download-btn');
  downloadBtn.textContent = 'Download TXT';
  downloadBtn.addEventListener('click', () => {
    downloadRecordAsTXT(record);
  });
  card.appendChild(summaryDiv);
  card.appendChild(detailsDiv);
  card.appendChild(toggleBtn);
  card.appendChild(downloadBtn);
  return card;
}
function downloadRecordAsTXT(record) {
  let content = "";
  content += `Question: ${record.question}\n`;
  content += `Correct Answer: ${record.correctAnswer}\n`;
  content += `User's Answer: ${record.userAnswer}\n`;
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = record.explanation;
  const explanationText = tempDiv.textContent || tempDiv.innerText || "";
  content += `Explanation: ${explanationText}\n`;
  content += `Time Taken: ${record.timeTaken}\n`;
  content += `Start Time: ${record.started}\n`;
  content += `End Time: ${record.submitted}\n`;
  
  const blob = new Blob([content], { type: 'text/plain' });
  const fileName = `Question_${record.submitted.replace(/:/g, '-')}.txt`;
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ================================
// TXT Generation and Download for Session Reports
// ================================
function downloadSessionReport() {
  if (sessionReports.length === 0) {
    showNotification("No session reports available.", "error");
    return;
  }
  let content = "Session Reports:\n\n";
  sessionReports.forEach((report, index) => {
    content += `Session ${index + 1} - Date: ${report.date}\n`;
    content += `Total Questions: ${report.total}\n`;
    content += `Correct Answers: ${report.correct}\n`;
    content += `Wrong Answers: ${report.wrong}\n`;
    content += `Average Response Time: ${report.averageResponseTime} s\n`;
    content += `Accuracy: ${report.accuracy}%\n`;
    content += `-------------------------\n`;
  });
  const blob = new Blob([content], { type: 'text/plain' });
  const fileName = `Session_Reports_${new Date().toLocaleDateString().replace(/\//g, '-')}.txt`;
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showNotification("Session report downloaded!", "success");
}

// ================================
// Enhanced Statistics Dashboard (Session Reports)
// ================================
function updateStatisticsDashboard() {
  const ctx = document.getElementById('statsChart').getContext('2d');
  let labels = [];
  let avgResponseTimes = [];
  let accuracies = [];
  sessionReports.forEach((report, index) => {
    labels.push(`Session ${index + 1}`);
    avgResponseTimes.push(report.averageResponseTime);
    accuracies.push(report.accuracy);
  });
  
  if (window.chartStats) {
    window.chartStats.data.labels = labels;
    window.chartStats.data.datasets = [
      {
        label: 'Average Response Time (s)',
        data: avgResponseTimes,
        borderColor: 'rgba(255, 182, 162, 1)',
        backgroundColor: 'rgba(255, 182, 162, 0.2)',
        fill: true,
        tension: 0.1
      },
      {
        label: 'Accuracy (%)',
        data: accuracies,
        borderColor: 'rgba(162, 255, 182, 1)',
        backgroundColor: 'rgba(162, 255, 182, 0.2)',
        fill: true,
        tension: 0.1,
        yAxisID: 'y1'
      }
    ];
    window.chartStats.update();
  } else {
    window.chartStats = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Average Response Time (s)',
            data: avgResponseTimes,
            borderColor: 'rgba(255, 182, 162, 1)',
            backgroundColor: 'rgba(255, 182, 162, 0.2)',
            fill: true,
            tension: 0.1
          },
          {
            label: 'Accuracy (%)',
            data: accuracies,
            borderColor: 'rgba(162, 255, 182, 1)',
            backgroundColor: 'rgba(162, 255, 182, 0.2)',
            fill: true,
            tension: 0.1,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        scales: {
          x: { title: { display: true, text: 'Session' } },
          y: { title: { display: true, text: 'Average Response Time (s)' }, beginAtZero: true },
          y1: { position: 'right', title: { display: true, text: 'Accuracy (%)' }, beginAtZero: true, grid: { drawOnChartArea: false } }
        }
      }
    });
  }
}

// ================================
// Current Session Response Times Chart (Line Graph)
// ================================
function updateQuestionResponseChart() {
  const ctx = document.getElementById('questionChart').getContext('2d');
  let labels = historyRecords.map((_, index) => `Q${index + 1}`);
  let times = historyRecords.map(rec => parseInt(rec.timeTaken));
  
  if (questionChart) {
    questionChart.data.labels = labels;
    questionChart.data.datasets[0].data = times;
    questionChart.update();
  } else {
    questionChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Response Time (s)',
          data: times,
          borderColor: 'rgba(100, 149, 237, 1)',
          backgroundColor: 'rgba(100, 149, 237, 0.2)',
          fill: false,
          tension: 0.1
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Time (s)' } }
        }
      }
    });
  }
}

// ================================
// Session Report Overview Chart
// ================================
function updateSessionReportChart() {
  const ctx = document.getElementById('sessionReportChart').getContext('2d');
  let labels = [];
  let totalArr = [];
  let correctArr = [];
  let wrongArr = [];
  sessionReports.forEach((report, index) => {
    labels.push(`S${index + 1}`);
    totalArr.push(report.total);
    correctArr.push(report.correct);
    wrongArr.push(report.wrong);
  });
  
  if (sessionReportChart) {
    sessionReportChart.data.labels = labels;
    sessionReportChart.data.datasets[0].data = totalArr;
    sessionReportChart.data.datasets[1].data = correctArr;
    sessionReportChart.data.datasets[2].data = wrongArr;
    sessionReportChart.update();
  } else {
    sessionReportChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Total Questions',
            data: totalArr,
            backgroundColor: 'rgba(255, 206, 86, 0.5)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1
          },
          {
            label: 'Correct Answers',
            data: correctArr,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Wrong Answers',
            data: wrongArr,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Count' } }
        }
      }
    });
  }
}

// ================================
// Session Report Functions
// ================================
function endSession() {
  if (historyRecords.length === 0) {
    showNotification("No session data to save.", "error");
    return;
  }
  const total = totalSumsCount;
  const correct = correctCount;
  const wrong = wrongCount;
  let totalTime = 0;
  historyRecords.forEach(record => {
    totalTime += parseInt(record.timeTaken);
  });
  const avgResponseTime = (historyRecords.length > 0) ? (totalTime / historyRecords.length).toFixed(2) : 0;
  const accuracy = (total > 0) ? ((correct / total) * 100).toFixed(2) : 0;
  const sessionReport = {
    date: new Date().toLocaleDateString(),
    total,
    correct,
    wrong,
    averageResponseTime: parseFloat(avgResponseTime),
    accuracy: parseFloat(accuracy)
  };
  sessionReports.push(sessionReport);
  localStorage.setItem('sessionReports', JSON.stringify(sessionReports));
  showNotification("Session ended and report saved!", "success");
  // Reset session stats
  historyRecords = [];
  resetScorecard();
  updateStatisticsDashboard();
  updateSessionReportChart();
  updateQuestionResponseChart();
}
if (downloadReportBtn) {
  downloadReportBtn.addEventListener('click', downloadSessionReport);
}
if (endSessionBtn) {
  endSessionBtn.addEventListener('click', endSession);
}

// ================================
// Delete Records Modal Handlers
// ================================
deleteRecordsBtn.addEventListener('click', () => {
  deleteRecordsModal.style.display = 'block';
});
cancelDeleteBtn.addEventListener('click', () => {
  deleteRecordsModal.style.display = 'none';
});
closeDeleteModal.addEventListener('click', () => {
  deleteRecordsModal.style.display = 'none';
});
confirmDeleteBtn.addEventListener('click', () => {
  // Clear all records
  historyRecords = [];
  sessionReports = [];
  warningsHistory = [];
  localStorage.removeItem('sessionReports');
  // Destroy charts if they exist
  if (questionChart) {
    questionChart.destroy();
    questionChart = null;
  }
  if (sessionReportChart) {
    sessionReportChart.destroy();
    sessionReportChart = null;
  }
  if (window.chartStats) {
    window.chartStats.destroy();
    window.chartStats = null;
  }
  updateScorecard();
  updateQuestionResponseChart();
  updateStatisticsDashboard();
  updateSessionReportChart();
  deleteRecordsModal.style.display = 'none';
  showNotification("All records have been deleted.", "success");
});

// ================================
// Start the first question (timer starts only after Start is clicked)
// ================================
generateQuestion();
