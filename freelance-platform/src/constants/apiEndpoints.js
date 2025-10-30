// src/constants/apiEndpoints.js
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  OAUTH_LOGIN: '/auth/oauth/:provider/login',
  OAUTH_LINK: '/auth/oauth/:provider/link',
  OAUTH_UNLINK: '/auth/oauth/:provider/unlink',
  GET_CURRENT_USER: '/auth/me',
  
  // Projects
  GET_PROJECTS: '/projects',
  CREATE_PROJECT: '/projects',
  GET_PROJECT: '/projects/:id',
  RESPOND_TO_PROJECT: '/projects/:id/respond',
  GET_MY_RESPONSES: '/projects/my/responses',
  GET_MY_PROJECTS: '/projects/client/my-projects',
  UPDATE_RESPONSE_STATUS: '/projects/:projectId/responses/:responseId',
  
  // Users
  GET_FREELANCERS: '/users/freelancers',
  GET_USER_PROFILE: '/users/:id',
  UPDATE_PROFILE: '/users/profile',
  
  // Chat
  SEND_MESSAGE: '/chat/message',
  GET_MESSAGES: '/chat/:projectId/messages'
};

export const API_ERRORS = {
  401: 'Требуется авторизация',
  403: 'Доступ запрещен',
  404: 'Ресурс не найден',
  500: 'Внутренняя ошибка сервера',
  NETWORK_ERROR: 'Ошибка сети'
};