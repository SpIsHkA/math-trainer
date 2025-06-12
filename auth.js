document.addEventListener('DOMContentLoaded', () => {
    // Сохраняем состояние при выходе
    window.addEventListener('beforeunload', saveStateToStorage);
    
    // Элементы страницы
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const backBtn = document.getElementById('auth-back-btn');
    const authStatus = document.getElementById('auth-status');
    
    // Обработчики событий
    loginBtn.addEventListener('click', login);
    registerBtn.addEventListener('click', register);
    backBtn.addEventListener('click', () => {
        saveStateToStorage();
        window.location.href = 'index.html';
    });
    
    function login() {
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        
        if (!email || !password) {
            authStatus.textContent = "Заполните все поля";
            return;
        }
        
        authStatus.textContent = "Реализация авторизации будет добавлена позже";
    }
    
    function register() {
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        
        if (!email || !password) {
            authStatus.textContent = "Заполните все поля";
            return;
        }
        
        if (password.length < 6) {
            authStatus.textContent = "Пароль должен быть не менее 6 символов";
            return;
        }
        
        authStatus.textContent = "Реализация регистрации будет добавлена позже";
    }
});