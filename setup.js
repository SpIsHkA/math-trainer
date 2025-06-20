document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('beforeunload', saveStateToStorage);
  
  const setupTitle = document.getElementById('setup-title');
  const numberButtons = document.querySelectorAll('.number-btn');
  const questionCountInput = document.getElementById('question-count');
  const startBtn = document.getElementById('start-btn');
  const backBtn = document.getElementById('back-to-main');
  
  // Всегда обновляем заголовок при загрузке
  updateTitle();
  
  function updateTitle() {
    if (state.operation === 'multiplication') {
      setupTitle.textContent = 'Настройка умножения';
    } else if (state.operation === 'division') {
      setupTitle.textContent = 'Настройка деления';
    }
  }
  
  // Инициализация кнопок
  numberButtons.forEach(button => {
    const number = parseInt(button.dataset.number);
    if (state.selectedNumbers.includes(number)) {
      button.classList.add('selected');
    }
    
    button.addEventListener('click', function() {
      const num = parseInt(this.dataset.number);
      this.classList.toggle('selected');
      
      if (this.classList.contains('selected')) {
        if (!state.selectedNumbers.includes(num)) {
          state.selectedNumbers.push(num);
        }
      } else {
        state.selectedNumbers = state.selectedNumbers.filter(n => n !== num);
      }
    });
  });
  
  // Устанавливаем сохраненное количество вопросов
  questionCountInput.value = state.questionCount || 10;
  
  startBtn.addEventListener('click', () => {
    const count = parseInt(questionCountInput.value);
    
    if (state.selectedNumbers.length === 0) {
      alert('Выберите хотя бы одно число!');
      return;
    }
    
    if (isNaN(count) || count < 1 || count > 50) {
      alert('Введите число от 1 до 50');
      return;
    }
    
    // Сохраняем количество вопросов в состояние
    state.questionCount = count;
    saveStateToStorage();
    window.location.href = 'quiz.html';
  });
  
  backBtn.addEventListener('click', () => {
    saveStateToStorage();
    window.location.href = 'index.html';
  });
});