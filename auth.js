document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const db = firebase.firestore();
    
    // Элементы страницы
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterBtn = document.getElementById('show-register-btn');
    const showLoginBtn = document.getElementById('show-login-btn');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const backBtn = document.getElementById('auth-back-btn');
    const authStatus = document.getElementById('auth-status');
    const avatarContainer = document.getElementById('avatar-selection');

    // Генерируем аватарки
AVATARS.forEach((url, index) => {
    const option = document.createElement('div');
    option.className = `avatar-option${index === 0 ? ' selected' : ''}`;
    option.dataset.avatar = index;
    option.innerHTML = `<img src="${url}" alt="Аватар ${index + 1}">`;
    avatarContainer.appendChild(option);
});

// Обработчики выбора
avatarContainer.addEventListener('click', (e) => {
    const option = e.target.closest('.avatar-option');
    if (!option) return;
    
    document.querySelectorAll('.avatar-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    option.classList.add('selected');
    document.getElementById('selected-avatar').value = option.dataset.avatar;
});
    
    // Переключение форм
    showRegisterBtn.addEventListener('click', () => {
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
    });
    
    showLoginBtn.addEventListener('click', () => {
        registerForm.style.display = 'none';
        loginForm.style.display = 'flex';
    });
    
    // Обработчики кнопок
    loginBtn.addEventListener('click', login);
    registerBtn.addEventListener('click', register);
    backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    // Валидация логина
    document.getElementById('auth-login').addEventListener('input', function() {
        this.value = this.value.replace(/[^a-zA-Z0-9]/g, '');
    });
    
    document.getElementById('reg-login').addEventListener('input', function() {
        this.value = this.value.replace(/[^a-zA-Z0-9]/g, '');
    });
    
    // Функция входа
    async function login() {
        const loginValue = document.getElementById('auth-login').value;
        const password = document.getElementById('auth-password').value;
    
        if (!loginValue || !password) {
            showAuthStatus("Заполните все поля", 'error');
            return;
        }
    
        try {
            const email = `${loginValue}@mathtrainer.com`;
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
        
            // Загружаем данные пользователя
            const userDoc = await db.collection('users').doc(userCredential.user.uid).get();
            if (userDoc.exists) {
                state.userData = userDoc.data();
            } else {
                state.userData = {
                    name: loginValue,
                    role: 'child'
                };
            }
        
            showAuthStatus("Вход выполнен успешно", 'success');
            saveUserData({
                uid: userCredential.user.uid,
                ...state.userData
            });
            
            // Загружаем статистику пользователя
            state.userStats = await loadStats();
            
            setTimeout(() => window.location.href = 'index.html', 1000);
        } catch (error) {
            showAuthStatus("Ошибка входа: " + error.message, 'error');
        }
    }
    
    // Функция регистрации
    async function register() {
        const loginValue = document.getElementById('reg-login').value;
        const name = document.getElementById('reg-name').value;
        const role = document.getElementById('reg-role').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        const avatarIndex = document.getElementById('selected-avatar').value || 0;
    
        // Валидация пароля
        if (password !== confirmPassword) {
            showAuthStatus("Пароли не совпадают", 'error');
            return;
        }
        
        if (password.length < 6) {
            showAuthStatus("Пароль должен быть не менее 6 символов", 'error');
            return;
        }
    
        try {
            const email = `${loginValue}@mathtrainer.com`;
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            
            // Генерируем уникальный код для ребенка
            let childCode = null;
            if (role === 'child') {
                childCode = generateChildCode();
            }
            
            // Сохраняем данные пользователя
            const userData = {
                login: loginValue,
                name: name,
                role: role,
                avatarIndex: parseInt(avatarIndex), // сохраняем индекс аватарки
                childCode: childCode,
                createdAt: new Date().toISOString(),
                ...(role === 'parent' ? { children: [] } : { parentId: null })
            };
        
            await db.collection('users').doc(userCredential.user.uid).set(userData);
        
            showAuthStatus("Регистрация прошла успешно!", 'success');
            saveUserData({
                uid: userCredential.user.uid,
                ...userData
            });
            
            // Создаем пустую статистику
            state.userStats = {
                totalQuestions: 0,
                totalCorrect: 0,
                attempts: []
            };
            await saveStats();
            
            setTimeout(() => window.location.href = 'index.html', 1000);
        } catch (error) {
            showAuthStatus("Ошибка регистрации: " + error.message, 'error');
        }
    }
    
    // Показать статус авторизации
    function showAuthStatus(message, type) {
        authStatus.textContent = message;
        authStatus.style.color = type === 'error' ? '#e74c3c' : '#2ecc71';
    }
});