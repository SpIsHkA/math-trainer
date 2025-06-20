document.addEventListener('DOMContentLoaded', async () => {
    // Проверка авторизации
    if (!state.currentUser) {
        alert("Пожалуйста, войдите в систему");
        window.location.href = 'index.html';
        return;
    }
    
    const backBtn = document.getElementById('stats-back-btn');
    const totalQuestionsElement = document.getElementById('total-questions');
    const totalCorrectElement = document.getElementById('total-correct');
    const accuracyElement = document.getElementById('accuracy');
    const lastAttemptsElement = document.getElementById('last-attempts');
    
    // Проверяем, смотрим ли мы статистику ребенка
    const childId = sessionStorage.getItem('viewingChildStats');
    let stats;
    let userName = "";
    
    try {
        if (childId) {
            // Загружаем данные ребенка
            try {
                const childDoc = await db.collection('users').doc(childId).get();
                if (childDoc.exists) {
                    const childData = childDoc.data();
                    userName = childData.name;
                }
            } catch (error) {
                console.log('Ошибка загрузки данных ребенка:', error);
            }
            
            // Загружаем статистику ребенка
            stats = await loadStats(childId);
            document.querySelector('h1').textContent = `Статистика: ${userName}`;
        } else {
            // Загружаем статистику текущего пользователя
            stats = await loadStats();
            document.querySelector('h1').textContent = 'Моя статистика';
        }
        
        // Показываем сообщение о загрузке
        lastAttemptsElement.innerHTML = '<p>Загрузка статистики...</p>';
        
        // Отображаем статистику
        totalQuestionsElement.textContent = stats.totalQuestions;
        totalCorrectElement.textContent = stats.totalCorrect;
        
        const accuracy = stats.totalQuestions > 0 
            ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
            : 0;
        accuracyElement.textContent = `${accuracy}%`;
        
        lastAttemptsElement.innerHTML = '';
        
        // Показываем последние результаты (новые сверху)
        const reversedAttempts = [...stats.attempts].reverse();
        
        if (reversedAttempts.length === 0) {
            lastAttemptsElement.innerHTML = '<p>Нет данных о предыдущих попытках</p>';
        } else {
            reversedAttempts.slice(0, 10).forEach(attempt => {
                const attemptElement = document.createElement('div');
                attemptElement.className = 'attempt-item';
                attemptElement.innerHTML = `
                    <span>${new Date(attempt.date).toLocaleString()}</span>
                    <span>${attempt.correct}/${attempt.total} ${attempt.operation === 'multiplication' ? '×' : '÷'}</span>
                `;
                lastAttemptsElement.appendChild(attemptElement);
            });
        }
    } catch (e) {
        console.error("Ошибка загрузки статистики:", e);
        lastAttemptsElement.innerHTML = '<p>Ошибка загрузки статистики</p>';
    }
    
    // Обработчик кнопки "Назад"
    backBtn.addEventListener('click', () => {
        if (childId) {
            sessionStorage.removeItem('viewingChildStats');
            window.location.href = 'profile.html';
        } else {
            window.location.href = 'index.html';
        }
    });
});