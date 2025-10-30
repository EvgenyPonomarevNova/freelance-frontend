// src/pages/OAuthCallback/OAuthCallback.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import './OAuthCallback.scss';

function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { oauthLogin } = useUser();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState('');

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const state = searchParams.get('state');
        
        console.log('🔐 OAuth Callback received:', { code, error, state });

        // Получаем провайдера из state или sessionStorage
        let provider = 'yandex';
        let action = 'login';
        
        if (state) {
          [provider, action] = state.split('_');
        } else {
          provider = sessionStorage.getItem('oauthProvider') || 'yandex';
          action = sessionStorage.getItem('oauthAction') || 'login';
        }

        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!code) {
          // Если нет кода, используем демо-режим
          console.log('🔄 No OAuth code, using demo mode');
          await handleDemoOAuth(provider, action);
          return;
        }

        // Выполняем OAuth логин с полученным кодом
        const result = await oauthLogin(provider, code);
        
        if (result.success) {
          setStatus('success');
          
          // Редирект в зависимости от действия
          setTimeout(() => {
            const redirectPath = action === 'register' ? '/profile-setup' : '/profile';
            navigate(redirectPath, { 
              replace: true,
              state: { 
                welcome: true,
                isOAuth: true,
                user: result.user 
              }
            });
          }, 1500);
          
        } else {
          throw new Error(result.error || 'OAuth authentication failed');
        }

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setError(error.message);
        
        // Сохраняем ошибку для показа на странице логина
        sessionStorage.setItem('oauthError', error.message);
      } finally {
        // Очищаем временные данные
        sessionStorage.removeItem('oauthProvider');
        sessionStorage.removeItem('oauthAction');
      }
    };

    const handleDemoOAuth = async (provider, action) => {
      try {
        // Генерируем демо-код для тестирования
        const demoCode = `demo_${provider}_${Date.now()}`;
        console.log('🎭 Using demo OAuth with code:', demoCode);
        
        const result = await oauthLogin(provider, demoCode);
        
        if (result.success) {
          setStatus('success');
          
          setTimeout(() => {
            const redirectPath = action === 'register' ? '/profile-setup' : '/profile';
            navigate(redirectPath, { 
              replace: true,
              state: { 
                welcome: true,
                isOAuth: true,
                isDemo: true,
                user: result.user 
              }
            });
          }, 1500);
        } else {
          throw new Error(result.error || 'Demo OAuth failed');
        }
      } catch (error) {
        console.error('Demo OAuth error:', error);
        setStatus('error');
        setError(error.message);
      }
    };

    processOAuthCallback();
  }, [searchParams, navigate, oauthLogin]);

  // Рендер разных состояний
  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <>
            <div className="spinner-large"></div>
            <h2>Выполняется авторизация...</h2>
            <p>Пожалуйста, подождите</p>
          </>
        );
      
      case 'success':
        return (
          <>
            <div className="success-icon">✅</div>
            <h2>Успешная авторизация!</h2>
            <p>Перенаправляем вас...</p>
          </>
        );
      
      case 'error':
        return (
          <>
            <div className="error-icon">❌</div>
            <h2>Ошибка авторизации</h2>
            <p className="error-text">{error}</p>
            <div className="action-buttons">
              <button 
                onClick={() => navigate('/login')}
                className="btn primary"
              >
                Вернуться к входу
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="btn secondary"
              >
                Попробовать регистрацию
              </button>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="oauth-callback">
      <div className="callback-container">
        {renderContent()}
      </div>
    </div>
  );
}

export default OAuthCallback;