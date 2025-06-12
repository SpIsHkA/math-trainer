document.addEventListener('DOMContentLoaded', () => {
    // Сохраняем состояние при выходе
    window.addEventListener('beforeunload', saveStateToStorage);
    
    // Элементы страницы
    const backBtn = document.getElementById('stats-back-btn');
    const totalQuestionsElement = document.getElementById('total-questions');
    const totalCorrectElement = document.getElementById('total-correct');
    const accuracyElement = document.getElementById('accuracy');
    const lastAttemptsElement = document.getElementById('last-attempts');
    
    // Загрузка и отображение статистики
    const stats = loadStats();
    totalQuestionsElement.textContent = stats.totalQuestions;
    totalCorrectElement.textContent = stats.totalCorrect;
    
    const accuracy = stats.totalQuestions > 0 
        ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
        : 0;
    accuracyElement.textContent = `${accuracy}%`;
    
    lastAttemptsElement.innerHTML = '';
    stats.attempts.slice(0, 10).forEach(attempt => {
        const attemptElement = document.createElement('div');
        attemptElement.className = 'attempt-item';
        attemptElement.innerHTML = `
            <span>${attempt.date}</span>
            <span>${attempt.correct}/${attempt.total} ${attempt.operation === 'multiplication' ? '×' : '÷'}</span>
        `;
        lastAttemptsElement.appendChild(attemptElement);
    });
    
    // Обработчики событий
    backBtn.addEventListener('click', () => {
        saveStateToStorage();
        window.location.href = 'index.html';
    });
});