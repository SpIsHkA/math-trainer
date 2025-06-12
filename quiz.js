document.addEventListener('DOMContentLoaded', () => {
    // Сохраняем состояние при выходе
    window.addEventListener('beforeunload', saveStateToStorage);
    
    // Элементы страницы
    const progressElement = document.getElementById('progress');
    const questionElement = document.getElementById('question');
    const feedbackElement = document.getElementById('feedback');
    const answerInput = document.getElementById('answer-input');
    const checkBtn = document.getElementById('check-btn');
    const quitBtn = document.getElementById('quit-btn');
    
    // Генерация вопросов при первом входе
    if (state.questions.length === 0) {
        generateQuestions();
    }
    
    // Показ текущего вопроса
    showCurrentQuestion();
    
    // Обработчики событий
    checkBtn.addEventListener('click', checkAnswer);
    quitBtn.addEventListener('click', confirmQuit);
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });
    
    function generateQuestions() {
        state.questions = [];
        state.currentQuestionIndex = 0;
        state.correctAnswers = 0;
        state.incorrectAnswers = 0;
    
        for (let i = 0; i < state.questionCount; i++) {
            const a = state.selectedNumbers[Math.floor(Math.random() * state.selectedNumbers.length)];
            const b = Math.floor(Math.random() * 9) + 1;
    
            if (state.operation === 'multiplication') {
                state.questions.push({
                    type: 'multiplication',
                    text: `${a} × ${b} = ?`,
                    answer: a * b
                });
            } else {
                const product = a * b;
                state.questions.push({
                    type: 'division',
                    text: `${product} ÷ ${a} = ?`,
                    answer: b
                });
            }
        }
    }
    
    function showCurrentQuestion() {
        const currentQuestion = state.questions[state.currentQuestionIndex];
        questionElement.textContent = currentQuestion.text;
        progressElement.textContent = `Вопрос ${state.currentQuestionIndex + 1} из ${state.questions.length}`;
        answerInput.value = '';
        feedbackElement.textContent = '';
        answerInput.focus();
    }
    
    function checkAnswer() {
        const userAnswer = parseInt(answerInput.value);
        if (isNaN(userAnswer)) {
            feedbackElement.textContent = 'Введите число!';
            feedbackElement.style.color = '#e74c3c';
            return;
        }
    
        const currentQuestion = state.questions[state.currentQuestionIndex];
        currentQuestion.userAnswer = userAnswer;
    
        if (userAnswer === currentQuestion.answer) {
            feedbackElement.textContent = 'Правильно! ✓';
            feedbackElement.style.color = '#2ecc71';
            state.correctAnswers++;
        } else {
            feedbackElement.textContent = `Ошибка! Правильно: ${currentQuestion.answer}`;
            feedbackElement.style.color = '#e74c3c';
            state.incorrectAnswers++;
        }
    
        setTimeout(() => {
            state.currentQuestionIndex++;
            saveStateToStorage();
            
            if (state.currentQuestionIndex < state.questions.length) {
                showCurrentQuestion();
            } else {
                saveResults();
                window.location.href = 'results.html';
            }
        }, 1500);
    }
    
    function confirmQuit() {
        if (confirm('Вы уверены, что хотите выйти? Прогресс будет потерян.')) {
            saveStateToStorage();
            window.location.href = 'index.html';
        }
    }
});