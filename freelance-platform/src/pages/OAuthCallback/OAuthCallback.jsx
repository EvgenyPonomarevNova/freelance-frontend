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

  useEffect(() => {
    const processOAuth = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const provider = sessionStorage.getItem('oauthProvider') || 'google';
        const action = sessionStorage.getItem('oauthAction') || 'login';

        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        // Обмениваем код на access token
        const result = await oauthLogin(provider, code);
        
        if (result.success) {
          setStatus('success');
          // Редирект в зависимости от действия
          const redirectPath = action === 'register' ? '/profile-setup' : '/profile';
          setTimeout(() => navigate(redirectPath), 2000);
        } else {
          throw new Error(result.error);
        }

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        sessionStorage.setItem('oauthError', error.message);
      } finally {
        // Очищаем временные данные
        sessionStorage.removeItem('oauthProvider');
        sessionStorage.removeItem('oauthAction');
      }
    };

    processOAuth();
  }, [searchParams, navigate, oauthLogin]);

  return (
    <div className="oauth-callback">
      <div className="callback-container">
        {status === 'processing' && (
          <>
            <div className="spinner-large"></div>
            <h2>Авторизация...</h2>
            <p>Пожалуйста, подождите</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="success-icon">✅</div>
            <h2>Успешная авторизация!</h2>
            <p>Перенаправляем вас...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="error-icon">❌</div>
            <h2>Ошибка авторизации</h2>
            <p>{sessionStorage.getItem('oauthError') || 'Произошла ошибка'}</p>
            <button 
              onClick={() => navigate('/login')}
              className="retry-btn"
            >
              Вернуться к входу
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default OAuthCallback;