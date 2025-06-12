document.addEventListener('DOMContentLoaded', () => {
    // Сохраняем состояние при выходе
    window.addEventListener('beforeunload', saveStateToStorage);
    
    // Элементы страницы
    const setupTitle = document.getElementById('setup-title');
    const numberButtons = document.querySelectorAll('.number-btn');
    const questionCountInput = document.getElementById('question-count');
    const startBtn = document.getElementById('start-btn');
    const backBtn = document.getElementById('back-to-main');
    
    // Инициализация данных
    if (state.operation === 'multiplication') {
        setupTitle.textContent = 'Настройка умножения';
    } else {
        setupTitle.textContent = 'Настройка деления';
    }
    
    // Восстановление выбранных чисел
    numberButtons.forEach(button => {
        const number = parseInt(button.dataset.number);
        if (state.selectedNumbers.includes(number)) {
            button.classList.add('selected');
        }
        
        button.addEventListener('click', toggleNumberSelection);
    });
    
    // Восстановление количества вопросов
    questionCountInput.value = state.questionCount;
    
    // Обработчики событий
    startBtn.addEventListener('click', startQuiz);
    backBtn.addEventListener('click', () => {
        saveStateToStorage();
        window.location.href = 'index.html';
    });
    
    function toggleNumberSelection(e) {
        const button = e.target;
        const number = parseInt(button.dataset.number);
        
        button.classList.toggle('selected');
        
        if (button.classList.contains('selected')) {
            if (!state.selectedNumbers.includes(number)) {
                state.selectedNumbers.push(number);
            }
        } else {
            state.selectedNumbers = state.selectedNumbers.filter(n => n !== number);
        }
    }
    
    function startQuiz() {
        if (state.selectedNumbers.length === 0) {
            alert('Выберите хотя бы одно число!');
            return;
        }
        
        const count = parseInt(questionCountInput.value);
        if (isNaN(count) || count < 1 || count > 50) {
            alert('Введите число от 1 до 50');
            return;
        }
        
        state.questionCount = count;
        saveStateToStorage();
        window.location.href = 'quiz.html';
    }
});