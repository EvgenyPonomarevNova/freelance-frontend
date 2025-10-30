// src/config/oauth.js
export const OAUTH_CONFIG = {
  google: {
    clientId: import.meta.env?.VITE_GOOGLE_CLIENT_ID || window.env?.VITE_GOOGLE_CLIENT_ID || "demo-google-client-id",
    scope: 'email profile',
  },
  yandex: {
    clientId: import.meta.env?.VITE_YANDEX_CLIENT_ID || window.env?.VITE_YANDEX_CLIENT_ID || "demo-yandex-client-id",
    authUrl: 'https://oauth.yandex.ru/authorize',
  },
  vk: {
    clientId: import.meta.env?.VITE_VK_CLIENT_ID || window.env?.VITE_VK_CLIENT_ID || "demo-vk-client-id",
    authUrl: 'https://oauth.vk.com/authorize',
    scope: 'email',
  }
};

export const getOAuthUrl = (provider, action = 'login') => {
  const config = OAUTH_CONFIG[provider];
  if (!config) {
    console.error(`Unknown OAuth provider: ${provider}`);
    return '#';
  }

  const baseUrls = {
    google: `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${config.clientId}&` +
      `redirect_uri=${encodeURIComponent(window.location.origin + '/oauth-callback')}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(config.scope)}&` +
      `state=${provider}_${action}`,
    
    yandex: `https://oauth.yandex.ru/authorize?` +
      `response_type=code&` +
      `client_id=${config.clientId}&` +
      `redirect_uri=${encodeURIComponent(window.location.origin + '/oauth-callback')}&` +
      `state=${provider}_${action}`,
    
    vk: `https://oauth.vk.com/authorize?` +
      `client_id=${config.clientId}&` +
      `display=page&` +
      `redirect_uri=${encodeURIComponent(window.location.origin + '/oauth-callback')}&` +
      `scope=${config.scope}&` +
      `response_type=code&` +
      `state=${provider}_${action}`
  };
  
  return baseUrls[provider];
};