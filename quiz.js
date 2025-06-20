document.addEventListener('DOMContentLoaded', () => {
  const progressElement = document.getElementById('progress');
  const questionElement = document.getElementById('question');
  const feedbackElement = document.getElementById('feedback');
  const answerInput = document.getElementById('answer-input');
  const checkBtn = document.getElementById('check-btn');
  const quitBtn = document.getElementById('quit-btn');
  
  // Генерируем вопросы, если их еще нет
  if (state.questions.length === 0) {
    generateQuestions();
  }
  
  // Показываем текущий вопрос
  showCurrentQuestion();
  
  // Генерация вопросов
  function generateQuestions() {
    state.questions = [];
    state.currentQuestionIndex = 0;
    state.correctAnswers = 0;
    state.incorrectAnswers = 0;

    const questionCount = state.questionCount || 10;
    
    for (let i = 0; i < questionCount; i++) {
      // Выбираем случайное число из выбранных
      const a = state.selectedNumbers[Math.floor(Math.random() * state.selectedNumbers.length)];
      
      // Второе число от 1 до 10
      const b = Math.floor(Math.random() * 10) + 1;

      if (state.operation === 'multiplication') {
        state.questions.push({
          text: `${a} × ${b} = ?`,
          answer: a * b
        });
      } else if (state.operation === 'division') {
        const product = a * b;
        state.questions.push({
          text: `${product} ÷ ${a} = ?`,
          answer: b
        });
      }
    }
  }
  
  // Показ текущего вопроса
  function showCurrentQuestion() {
    const q = state.questions[state.currentQuestionIndex];
    questionElement.textContent = q.text;
    progressElement.textContent = `Вопрос ${state.currentQuestionIndex + 1} из ${state.questions.length}`;
    answerInput.value = '';
    feedbackElement.textContent = '';
    answerInput.focus();
  }
  
  // Проверка ответа
  function checkAnswer() {
    const userAnswer = parseInt(answerInput.value);
    if (isNaN(userAnswer)) {
      feedbackElement.textContent = 'Введите число!';
      feedbackElement.style.color = '#e74c3c';
      return;
    }

    const q = state.questions[state.currentQuestionIndex];
    q.userAnswer = userAnswer;

    if (userAnswer === q.answer) {
      feedbackElement.textContent = 'Правильно! ✓';
      feedbackElement.style.color = '#2ecc71';
      state.correctAnswers++;
    } else {
      feedbackElement.textContent = `Ошибка! Правильно: ${q.answer}`;
      feedbackElement.style.color = '#e74c3c';
      state.incorrectAnswers++;
    }

    setTimeout(async () => {
      state.currentQuestionIndex++;
      saveStateToStorage();
      
      if (state.currentQuestionIndex < state.questions.length) {
        showCurrentQuestion();
      } else {
        // Сохраняем результаты и переходим на страницу результатов
        await saveResults();
        window.location.href = 'results.html';
      }
    }, 1500);
  }
  
  // Обработчики событий
  checkBtn.addEventListener('click', checkAnswer);
  answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
  });
  
  quitBtn.addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите выйти? Прогресс будет потерян.')) {
      window.location.href = 'index.html';
    }
  });
});