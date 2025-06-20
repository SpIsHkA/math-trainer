document.addEventListener('DOMContentLoaded', async () => {
    // Проверяем авторизацию
    if (!state.currentUser) {
        alert("Пожалуйста, войдите в систему");
        window.location.href = 'index.html';
        return;
    }try {
    const userDoc = await db.collection('users').doc(state.currentUser.uid).get();
    if (userDoc.exists) {
      state.userData = userDoc.data();
      saveStateToStorage(); // Сохраняем свежие данные
    }
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
  }
    
    // Элементы страницы
    const profileAvatar = document.getElementById('profile-avatar');
    const profileName = document.getElementById('profile-name');
    const profileRole = document.getElementById('profile-role');
    const childCodeSection = document.getElementById('child-code-section');
    const childCodeElement = document.getElementById('child-code');
    const parentSection = document.getElementById('parent-section');
    const addChildBtn = document.getElementById('add-child-btn');
    const childCodeInput = document.getElementById('child-code-input');
    const childrenList = document.getElementById('children-list');
    const backBtn = document.getElementById('back-btn');
    const logoutBtn = document.getElementById('logout-btn');
    

    if (state.userData.avatarIndex !== undefined && AVATARS[state.userData.avatarIndex]) {
        profileAvatar.src = AVATARS[state.userData.avatarIndex];
    } else {
        profileAvatar.src = AVATARS[0]; // аватар по умолчанию
    }
    // Заполняем информацию
    profileName.textContent = state.userData.name || "Пользователь";
    profileRole.textContent = state.userData.role === 'parent' ? 'Родитель' : 'Ребёнок';
    
    // Показываем соответствующие секции
    if (state.userData.role === 'child') {
        childCodeSection.style.display = 'block';
        childCodeElement.textContent = state.userData.childCode || 'Не сгенерирован';
    } else {
        parentSection.style.display = 'block';
        // Загружаем список детей
        await loadChildren();
    }
    
    // Обработчики событий
    addChildBtn.addEventListener('click', addChild);
    backBtn.addEventListener('click', () => window.location.href = 'index.html');
    logoutBtn.addEventListener('click', () => {
        firebase.auth().signOut().then(() => {
            // Сбрасываем состояние
            state.currentUser = null;
            state.userData = null;
            state.userStats = null;
            
            // Очищаем хранилище
            localStorage.removeItem('currentUser');
            localStorage.removeItem('appState');
            
            // Переходим на главную
            window.location.href = 'index.html';
        }).catch(error => {
            console.log("Ошибка выхода:", error);
            alert("Не удалось выйти из аккаунта");
        });
    });
    
    // Функция загрузки детей
    async function loadChildren() {
        childrenList.innerHTML = '';
        
        // Проверяем наличие детей
        if (!state.userData.children || state.userData.children.length === 0) {
            childrenList.innerHTML = '<p>У вас пока нет привязанных детей</p>';
            return;
        }
        
        for (const childId of state.userData.children) {
            try {
                const childDoc = await db.collection('users').doc(childId).get();
                if (childDoc.exists) {
                    const childData = childDoc.data();
                    
                    const childElement = document.createElement('div');
                    childElement.className = 'child-item';
                    childElement.innerHTML = `
                        <div>
                            <h4>${childData.name}</h4>
                            <p>Статистика: <a href="#" class="view-stats" data-child="${childId}">просмотреть</a></p>
                        </div>
                    `;
                    childrenList.appendChild(childElement);
                }
            } catch (error) {
                console.log('Ошибка загрузки данных ребенка:', error);
            }
        }
        
        // Добавляем обработчики для просмотра статистики
        document.querySelectorAll('.view-stats').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const childId = this.getAttribute('data-child');
                viewChildStats(childId);
            });
        });
    }
    
    // Функция добавления ребенка
    async function addChild() {
        const code = childCodeInput.value.trim().toUpperCase();
        if (!code) {
            alert('Введите код ребенка');
            return;
        }
        
        try {
            // Ищем ребенка по коду
            const snapshot = await db.collection('users')
                .where('childCode', '==', code)
                .limit(1)
                .get();
            
            if (snapshot.empty) {
                alert('Ребенок с таким кодом не найден');
                return;
            }
            
            const childDoc = snapshot.docs[0];
            const childId = childDoc.id;
            const childData = childDoc.data();
            
            // Проверяем, что это ребенок
            if (childData.role !== 'child') {
                alert('Этот код принадлежит не ребенку');
                return;
            }
            
            // Обновляем данные родителя
            const children = state.userData.children || [];
            if (!children.includes(childId)) {
                children.push(childId);
                await db.collection('users').doc(state.currentUser.uid).update({
                    children: children
                });
                
                // Обновляем данные ребенка
                await db.collection('users').doc(childId).update({
                    parentId: state.currentUser.uid
                });
                
                // Обновляем локальное состояние
                state.userData.children = children;
                await loadChildren();
                alert(`${childData.name} успешно добавлен(а) к вашим детям`);
            } else {
                alert('Этот ребенок уже добавлен');
            }
        } catch (error) {
            console.log('Ошибка при добавлении ребенка:', error);
            alert('Произошла ошибка при добавлении ребенка');
        }
    }
    
    // Функция просмотра статистики ребенка
    function viewChildStats(childId) {
        // Сохраняем ID ребенка в sessionStorage
        sessionStorage.setItem('viewingChildStats', childId);
        window.location.href = 'stats.html';
    }
});

// Функция загрузки статистики ребенка
async function loadChildStats() {
    const stats = await loadStats();
    document.getElementById('child-total-questions').textContent = stats.totalQuestions;
    document.getElementById('child-total-correct').textContent = stats.totalCorrect;
        
    const accuracy = stats.totalQuestions > 0 
        ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
        : 0;
    document.getElementById('child-accuracy').textContent = `${accuracy}%`;
}

// В функции инициализации профиля
const profileAvatar = document.getElementById('profile-avatar');
if (state.userData.avatarIndex !== undefined) {
    profileAvatar.src = AVATARS[state.userData.avatarIndex];
} else {
    profileAvatar.src = AVATARS[0]; // аватар по умолчанию
}