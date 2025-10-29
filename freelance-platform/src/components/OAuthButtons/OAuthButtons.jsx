// src/components/OAuthButtons/OAuthButtons.jsx
import './OAuthButtons.scss';
import { useUser } from '../../contexts/UserContext';

function OAuthButtons({ type = 'login', isLoading = false }) {
  const { getOAuthUrl, quickOAuthLogin } = useUser();

  const handleOAuthClick = (provider) => {
    // Для демо-режима используем быстрый вход
    if (provider === 'demo') {
      quickOAuthLogin('google');
      return;
    }

    const oauthUrl = getOAuthUrl(provider, type);
    // Сохраняем тип действия в sessionStorage для callback страницы
    sessionStorage.setItem('oauthAction', type);
    sessionStorage.setItem('oauthProvider', provider);
    
    // Редирект на OAuth провайдера
    window.location.href = oauthUrl;
  };

  const providers = [
    {
      id: 'google',
      name: 'Google',
      icon: '🔍',
      color: '#4285F4',
      className: 'google-btn'
    },
    {
      id: 'yandex', 
      name: 'Yandex',
      icon: '🌐',
      color: '#FF0000',
      className: 'yandex-btn'
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