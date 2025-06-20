document.addEventListener('DOMContentLoaded', () => {
    // Использовать window.state вместо state
    console.log(window.state);
    // Сохраняем состояние при выходе
    window.addEventListener('beforeunload', saveStateToStorage);
    
    // Элементы страницы
    const correctCountElement = document.getElementById('correct-count');
    const incorrectCountElement = document.getElementById('incorrect-count');
    const menuBtn = document.getElementById('menu-btn');
    const retryBtn = document.getElementById('retry-btn');
    
    // Отображение результатов
    correctCountElement.textContent = state.correctAnswers;
    incorrectCountElement.textContent = state.incorrectAnswers;
    
    // Обработчики событий
    menuBtn.addEventListener('click', () => {
        state.questions = [];
        saveStateToStorage();
        window.location.href = 'index.html';
    });
    
    retryBtn.addEventListener('click', retryIncorrect);
    
    function retryIncorrect() {
        if (state.incorrectAnswers === 0) {
            alert('У вас не было ошибок!');
            return;
        }
        
        state.questions = state.questions.filter(q => q.userAnswer !== q.answer);
        state.questionCount = state.questions.length;
        state.currentQuestionIndex = 0;
        state.correctAnswers = 0;
        state.incorrectAnswers = 0;
        
        saveStateToStorage();
        window.location.href = 'quiz.html';
    }
});