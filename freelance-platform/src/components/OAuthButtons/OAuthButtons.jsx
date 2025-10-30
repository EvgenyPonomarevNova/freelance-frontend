// src/components/OAuthButtons/OAuthButtons.jsx
import './OAuthButtons.scss';
import { useUser } from '../../contexts/UserContext';
import { getOAuthUrl } from '../../config/oauth';

function OAuthButtons({ type = 'login', isLoading = false }) {
  const { quickOAuthLogin } = useUser();

  const handleOAuthClick = (provider) => {
    // Для демо-режима используем быстрый вход
    if (provider === 'demo') {
      quickOAuthLogin('yandex');
      return;
    }

    // Получаем OAuth URL для редиректа
    const oauthUrl = getOAuthUrl(provider, type);
    
    console.log(`🔐 OAuth ${type} for ${provider}:`, oauthUrl);
    
    // Сохраняем тип действия в sessionStorage для callback страницы
    sessionStorage.setItem('oauthAction', type);
    sessionStorage.setItem('oauthProvider', provider);
    
    // Редирект на OAuth провайдера
    window.location.href = oauthUrl;
  };

  const providers = [
    {
      id: 'yandex', 
      name: 'Yandex',
      icon: '🌐',
      color: '#FF0000',
      className: 'yandex-btn'
    },
    {
      id: 'google',
      name: 'Google',
      icon: '🔍',
      color: '#4285F4',
      className: 'google-btn'
    },
    {
      id: 'vk',
      name: 'VK',
      icon: '👥',
      color: '#0077FF',
      className: 'vk-btn'
    }
  ];

  return (
    <div className="oauth-buttons">
      <div className="oauth-divider">
        <span>Или продолжить с помощью</span>
      </div>

      <div className="oauth-providers">
        {providers.map(provider => (
          <button
            key={provider.id}
            type="button"
            className={`oauth-btn ${provider.className} ${isLoading ? 'disabled' : ''}`}
            onClick={() => handleOAuthClick(provider.id)}
            disabled={isLoading}
            style={{ '--brand-color': provider.color }}
          >
            <span className="oauth-icon">{provider.icon}</span>
            <span className="oauth-text">{provider.name}</span>
          </button>
        ))}
      </div>

      {/* Демо-кнопка для тестирования */}
      <div className="demo-section">
        <button
          type="button"
          className="oauth-btn demo-btn"
          onClick={() => handleOAuthClick('demo')}
          disabled={isLoading}
        >
          <span className="oauth-icon">🚀</span>
          <span className="oauth-text">Быстрый демо-вход</span>
        </button>
        <div className="demo-note">
          Для тестирования без реальной OAuth авторизации
        </div>
      </div>

      <div className="oauth-note">
        {type === 'login' 
          ? 'Войдите быстро без ввода пароля'
          : 'Зарегистрируйтесь в один клик'
        }
      </div>
    </div>
  );
}

export default OAuthButtons;