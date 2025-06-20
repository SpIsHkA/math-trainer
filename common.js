// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHaPUscgqd-jEyjh6st5Un3Eg8ns3oLQU",
  authDomain: "mathtrainer-f7898.firebaseapp.com",
  projectId: "mathtrainer-f7898",
  storageBucket: "mathtrainer-f7898.appspot.com",
  messagingSenderId: "475439097301",
  appId: "1:475439097301:web:af98ec3211527c7b55895c"
};

const APP_VERSION = '1.3';

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Firestore instance
const db = firebase.firestore();

// Application state
const state = {
  operation: null,
  selectedNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  questionCount: 10,
  questions: [],
  currentQuestionIndex: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  currentUser: null,
  userData: null,
  userStats: null
};

// Storage functions
function saveStateToStorage() {
  sessionStorage.setItem('appState', JSON.stringify(state));
}

function loadStateFromStorage() {
  const savedState = sessionStorage.getItem('appState');
  if (savedState) {
    Object.assign(state, JSON.parse(savedState));
  }
}

// Загружаем состояние при запуске
loadStateFromStorage();

// Функции для работы с пользователем
function saveUserData(user) {
  state.currentUser = user;
  state.userData = user;
  localStorage.setItem('currentUser', JSON.stringify(user));
}

function loadUserData() {
  const user = localStorage.getItem('currentUser');
  if (user) {
    const parsedUser = JSON.parse(user);
    state.currentUser = parsedUser;
    state.userData = parsedUser;
  }
}

// Загружаем данные пользователя при запуске
loadUserData();

// Статистика: загрузка с сервера
async function loadStats(userId = null) {
  const uid = userId || (state.currentUser ? state.currentUser.uid : null);
  
  if (!uid) {
    return {
      totalQuestions: 0,
      totalCorrect: 0,
      attempts: []
    };
  }
  
  try {
    const doc = await db.collection('userStats').doc(uid).get();
    if (doc.exists) {
      return doc.data();
    }
  } catch (error) {
    console.error('Ошибка загрузки статистики:', error);
  }
  
  return {
    totalQuestions: 0,
    totalCorrect: 0,
    attempts: []
  };
}

// Статистика: сохранение на сервере
async function saveStats(userId = null) {
  const uid = userId || (state.currentUser ? state.currentUser.uid : null);
  if (!uid || !state.userStats) return;
  
  try {
    await db.collection('userStats').doc(uid).set(state.userStats);
    console.log('Статистика сохранена на сервере');
  } catch (error) {
    console.error('Ошибка сохранения статистики:', error);
  }
}

// Сохранение результатов тренировки
async function saveResults() {
  // Обновляем статистику
  state.userStats = await loadStats();
  
  state.userStats.totalQuestions += state.questions.length;
  state.userStats.totalCorrect += state.correctAnswers;
  
  const attempt = {
    date: new Date().toISOString(),
    correct: state.correctAnswers,
    total: state.questions.length,
    operation: state.operation
  };
  
  state.userStats.attempts.push(attempt);
  state.userStats.attempts = state.userStats.attempts.slice(-10);
  
  // Сохраняем на сервере
  await saveStats();
}

// Update notification functions
function checkForUpdates() {
  const lastSeenVersion = localStorage.getItem('lastSeenVersion');
  
  if (lastSeenVersion !== APP_VERSION) {
    localStorage.setItem('lastSeenVersion', APP_VERSION);
    return getUpdateInfo();
  }
  
  return null;
}

// Генерация уникального кода для ребенка
function generateChildCode() {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        if (i > 0 && i % 4 === 0) code += '-';
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

function getUpdateInfo() {
  const updates = {
    '1.3': [
      'Добавлена система авторизации',
      'Синхронизация статистики между устройствами',
      'Личный кабинет пользователя',
      'Статистика детей в аккаунте родителей'
    ]
  };
  
  return updates[APP_VERSION] || null;
}

const AVATARS = [
    "./avatars/bear.jpeg", // медведь
    "./avatars/duck.jpeg",   // утка
    "./avatars/hedgehog.jpeg", // ежик
    "./avatars/horse.jpeg"  // лошадь
];

// Make variables globally available
window.state = state;
window.firebase = firebase;
window.db = db;
window.saveStateToStorage = saveStateToStorage;
window.saveResults = saveResults;
window.loadStats = loadStats;
window.saveStats = saveStats;
window.APP_VERSION = APP_VERSION;
window.checkForUpdates = checkForUpdates;
window.getUpdateInfo = getUpdateInfo;
window.generateChildCode = generateChildCode;
window.AVATARS = AVATARS;