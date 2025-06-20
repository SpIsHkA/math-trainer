document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('beforeunload', saveStateToStorage);
  
  // Проверяем существование элементов перед добавлением обработчиков
  const multiplicationBtn = document.getElementById('multiplication-btn');
  const divisionBtn = document.getElementById('division-btn');
  const authBtn = document.getElementById('auth-btn');
  const profileBtn = document.getElementById('profile-btn');
  
  if (multiplicationBtn) {
    multiplicationBtn.addEventListener('click', () => {
      state.operation = 'multiplication';
      saveStateToStorage();
      window.location.href = 'setup.html';
    });
  }
  
  if (divisionBtn) {
    divisionBtn.addEventListener('click', () => {
      state.operation = 'division';
      saveStateToStorage();
      window.location.href = 'setup.html';
    });
  }
  
  if (authBtn) {
    authBtn.addEventListener('click', () => {
      saveStateToStorage();
      window.location.href = 'auth.html';
    });
  }
  
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      window.location.href = 'profile.html';
    });
  }
});