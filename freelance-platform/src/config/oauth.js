// src/config/oauth.js
export const OAUTH_CONFIG = {
  google: {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    scope: 'email profile',
  },
  yandex: {
    clientId: process.env.REACT_APP_YANDEX_CLIENT_ID,
    authUrl: 'https://oauth.yandex.ru/authorize',
  },
  vk: {
    clientId: process.env.REACT_APP_VK_CLIENT_ID,
    authUrl: 'https://oauth.vk.com/authorize',
    scope: 'email',
  }
}