document.addEventListener('DOMContentLoaded', () => {
    // Сохраняем состояние при выходе
    window.addEventListener('beforeunload', saveStateToStorage);
    
    // Обработчики кнопок
    document.getElementById('multiplication-btn').addEventListener('click', () => {
        state.operation = 'multiplication';
        saveStateToStorage();
        window.location.href = 'setup.html';
    });
    
    document.getElementById('division-btn').addEventListener('click', () => {
        state.operation = 'division';
        saveStateToStorage();
        window.location.href = 'setup.html';
    });
    
    document.getElementById('show-stats-btn').addEventListener('click', () => {
        saveStateToStorage();
        window.location.href = 'stats.html';
    });
    
    document.getElementById('auth-btn').addEventListener('click', () => {
        saveStateToStorage();
        window.location.href = 'auth.html';
    });
});