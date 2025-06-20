document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('beforeunload', saveStateToStorage);
  
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
  
  document.getElementById('auth-btn').addEventListener('click', () => {
    saveStateToStorage();
    window.location.href = 'auth.html';
  });
});