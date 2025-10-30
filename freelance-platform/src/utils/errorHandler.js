// src/utils/errorHandler.js
export const handleApiError = (error, fallbackMessage = "Произошла ошибка") => {
  console.error('API Error:', error);
  
  if (error.message.includes('401')) {
    // Автоматический logout при 401
    localStorage.removeItem('token');
    localStorage.removeItem('current_user');
    window.location.href = '/login';
    return 'Сессия истекла. Пожалуйста, войдите снова.';
  }
  
  if (error.message.includes('403')) {
    return 'Доступ запрещен';
  }
  
  if (error.message.includes('404')) {
    return 'Ресурс не найден';
  }
  
  if (error.message.includes('Network Error')) {
    return 'Ошибка сети. Проверьте подключение к интернету.';
  }
  
  return error.message || fallbackMessage;
};

export const showErrorToast = (message, type = 'error') => {
  // Можно интегрировать с toast-библиотекой или использовать alert
  if (type === 'error') {
    alert(`❌ ${message}`);
  } else {
    alert(`✅ ${message}`);
  }
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};