// Общие константы
const APP_VERSION = "1.2";
const VERSION_KEY = "mathAppVersion";
const LAST_UPDATE_KEY = "lastUpdateShown";
const LOCAL_STATS_KEY = 'mathTrainerStats';

// Чанглог
const CHANGELOG = {
    "1.2": [
        "Подготовка к добавлению авторизации",
        "Улучшена структура проекта"
    ],
    "1.1": [
        "Добавлена полная статистика",
        "История последних 10 попыток",
        "Отображение точности ответов"
    ],
    "1.0": [
        "Первая версия приложения",
        "Режимы умножения и деления",
        "Базовые функции тестирования"
    ]
};

// Общее состояние
const state = {
    operation: null,
    selectedNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    questionCount: 10,
    questions: [],
    currentQuestionIndex: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    currentUser: null
};

// Функции управления версиями
function checkForUpdates() {
    const lastVersion = localStorage.getItem(VERSION_KEY);
    const lastUpdateShown = localStorage.getItem(LAST_UPDATE_KEY);
    
    if (lastVersion !== APP_VERSION) {
        showUpdateNotification();
        localStorage.setItem(VERSION_KEY, APP_VERSION);
    } 
    else if (lastUpdateShown !== APP_VERSION) {
        showUpdateNotification();
    }
}

function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <h3>Обновление до v${APP_VERSION}</h3>
        <p>Что нового в этой версии:</p>
        <ul style="text-align: left; padding-left: 20px;">
            ${CHANGELOG[APP_VERSION].map(item => `<li>${item}</li>`).join('')}
        </ul>
        <button id="close-update" class="btn" style="margin-top: 15px;">Закрыть</button>
    `;
    
    document.body.appendChild(notification);
    
    document.getElementById('close-update').addEventListener('click', () => {
        notification.remove();
        localStorage.setItem(LAST_UPDATE_KEY, APP_VERSION);
    });
}

// Функции работы с хранилищем
function saveStateToStorage() {
    sessionStorage.setItem('appState', JSON.stringify(state));
}

function loadStateFromStorage() {
    const savedState = sessionStorage.getItem('appState');
    if (savedState) {
        Object.assign(state, JSON.parse(savedState));
    }
}

function saveResults() {
    const localStats = JSON.parse(localStorage.getItem(LOCAL_STATS_KEY)) || {
        totalQuestions: 0,
        totalCorrect: 0,
        attempts: []
    };
    
    localStats.totalQuestions += state.questions.length;
    localStats.totalCorrect += state.correctAnswers;
    
    const attempt = {
        date: new Date().toLocaleString(),
        correct: state.correctAnswers,
        total: state.questions.length,
        operation: state.operation
    };
    
    localStats.attempts.push(attempt);
    localStats.attempts = localStats.attempts.slice(-10);
    localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(localStats));
}

function loadStats() {
    return JSON.parse(localStorage.getItem(LOCAL_STATS_KEY)) || {
        totalQuestions: 0,
        totalCorrect: 0,
        attempts: []
    };
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    loadStateFromStorage();
    checkForUpdates();
});
