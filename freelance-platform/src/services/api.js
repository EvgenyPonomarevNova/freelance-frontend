// src/services/api.js
class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
    this.isMockMode = !import.meta.env.VITE_API_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Для демо-режима возвращаем mock данные
    if (this.isMockMode && this.shouldMock(endpoint)) {
      return this.mockResponse(endpoint, options);
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Добавляем токен авторизации
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (options.body && typeof options.body === "object") {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("current_user");
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      
      // В демо-режиме возвращаем mock данные при ошибке
      if (this.isMockMode) {
        return this.mockResponse(endpoint, options);
      }
      
      throw error;
    }
  }

  // Mock responses для демо-режима
  shouldMock(endpoint) {
    const mockEndpoints = [
      '/auth/oauth',
      '/auth/oauth/link',
      '/auth/oauth/unlink'
    ];
    return mockEndpoints.some(mockEndpoint => endpoint.includes(mockEndpoint));
  }

  mockResponse(endpoint, options) {
    console.log('📱 Using mock response for:', endpoint);
    
    // OAuth авторизация
    if (endpoint.includes('/auth/oauth/login')) {
      const provider = endpoint.split('/').pop() || 'google';
      return this.mockOAuthLogin(provider, options.body);
    }
    
    // Связывание OAuth
    if (endpoint.includes('/auth/oauth/link')) {
      return { success: true, message: 'OAuth account linked successfully' };
    }
    
    // Отвязывание OAuth
    if (endpoint.includes('/auth/oauth/unlink')) {
      return { success: true, message: 'OAuth account unlinked successfully' };
    }
    
    return { success: true, message: 'Mock response' };
  }

  mockOAuthLogin(provider, body) {
    const demoUsers = {
      google: {
        id: 1001,
        email: 'demo.google@freelancehub.ru',
        fullName: 'Демо Google Пользователь',
        role: 'freelancer',
        profile: {
          avatar: null,
          bio: `Пользователь авторизованный через Google`,
          skills: ['JavaScript', 'React', 'TypeScript'],
          rating: 4.9,
          completedProjects: 15,
          isEmailVerified: true,
          oauthProvider: 'google'
        }
      },
      yandex: {
        id: 1002,
        email: 'demo.yandex@freelancehub.ru',
        fullName: 'Демо Yandex Пользователь', 
        role: 'freelancer',
        profile: {
          avatar: null,
          bio: `Пользователь авторизованный через Yandex`,
          skills: ['Python', 'Django', 'PostgreSQL'],
          rating: 4.7,
          completedProjects: 8,
          isEmailVerified: true,
          oauthProvider: 'yandex'
        }
      },
      vk: {
        id: 1003,
        email: 'demo.vk@freelancehub.ru',
        fullName: 'Демо VK Пользователь',
        role: 'client',
        profile: {
          avatar: null,
          bio: `Заказчик авторизованный через VK`,
          skills: [],
          rating: 5.0,
          completedProjects: 0,
          isEmailVerified: true,
          oauthProvider: 'vk'
        }
      }
    };

    const user = demoUsers[provider] || demoUsers.google;
    const token = `demo_oauth_token_${provider}_${Date.now()}`;

    return {
      success: true,
      user,
      token,
      isDemo: true
    };
  }

  // OAuth методы
  async oauthLogin(provider, code) {
    try {
      const response = await this.request(`/auth/oauth/${provider}/login`, {
        method: "POST",
        body: {
          code,
          redirect_uri: `${window.location.origin}/oauth-callback`
        }
      });

      // Сохраняем токен и пользователя
      if (response.token && response.user) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("current_user", JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      console.error('OAuth login error:', error);
      
      // В демо-режиме используем mock
      if (this.isMockMode) {
        const mockResponse = this.mockOAuthLogin(provider, { code });
        localStorage.setItem("token", mockResponse.token);
        localStorage.setItem("current_user", JSON.stringify(mockResponse.user));
        return mockResponse;
      }
      
      throw error;
    }
  }

  // Связывание OAuth с аккаунтом
  async linkOAuthAccount(provider, code) {
    return this.request(`/auth/oauth/${provider}/link`, {
      method: "POST",
      body: {
        code,
        redirect_uri: `${window.location.origin}/oauth-callback`
      }
    });
  }

  // Отвязывание OAuth аккаунта
  async unlinkOAuthAccount(provider) {
    return this.request(`/auth/oauth/${provider}/unlink`, {
      method: "DELETE"
    });
  }

  // Получение OAuth URL (для фронтенда)
  getOAuthUrl(provider, action = 'login') {
    const config = {
      google: {
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'demo-google-client-id',
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        scope: 'email profile'
      },
      yandex: {
        clientId: import.meta.env.VITE_YANDEX_CLIENT_ID || 'demo-yandex-client-id', 
        authUrl: 'https://oauth.yandex.ru/authorize',
        scope: 'login:email login:info'
      },
      vk: {
        clientId: import.meta.env.VITE_VK_CLIENT_ID || 'demo-vk-client-id',
        authUrl: 'https://oauth.vk.com/authorize',
        scope: 'email'
      }
    };

    const providerConfig = config[provider];
    if (!providerConfig) {
      console.error(`Unknown OAuth provider: ${provider}`);
      return '#';
    }

    const params = new URLSearchParams({
      client_id: providerConfig.clientId,
      redirect_uri: `${window.location.origin}/oauth-callback`,
      response_type: 'code',
      scope: providerConfig.scope,
      state: `${provider}_${action}`,
      ...(provider === 'vk' && { display: 'popup' })
    });

    return `${providerConfig.authUrl}?${params.toString()}`;
  }

  // Существующие методы остаются без изменений
  async login(email, password) {
    const response = await this.request("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    if (response.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("current_user", JSON.stringify(response.user));
    }

    return response;
  }

  async register(userData) {
    const response = await this.request("/auth/register", {
      method: "POST",
      body: userData,
    });

    if (response.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("current_user", JSON.stringify(response.user));
    }

    return response;
  }

  async getCurrentUser() {
    try {
      const response = await this.request("/auth/me");

      if (response.user) {
        localStorage.setItem("current_user", JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      if (error.message.includes("401")) {
        localStorage.removeItem("token");
        localStorage.removeItem("current_user");
      }
      throw error;
    }
  }

  // Project methods
  async getProjects(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/projects?${queryParams}`);
  }

  async createProject(projectData) {
    return this.request("/projects", {
      method: "POST",
      body: projectData,
    });
  }

  async getProject(projectId) {
    return this.request(`/projects/${projectId}`);
  }

  async respondToProject(projectId, responseData) {
    return this.request(`/projects/${projectId}/respond`, {
      method: "POST",
      body: responseData,
    });
  }

  async getMyResponses() {
    return this.request("/projects/my/responses");
  }

  async getMyProjects() {
    return this.request("/projects/client/my-projects");
  }

  async updateResponseStatus(projectId, responseId, status) {
    return this.request(`/projects/${projectId}/responses/${responseId}`, {
      method: "PATCH",
      body: { status },
    });
  }

  // User methods
  async getFreelancers(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/users/freelancers?${queryParams}`);
  }

  async getUserProfile(userId) {
    return this.request(`/users/${userId}`);
  }

  async updateProfile(profileData) {
    const response = await this.request("/users/profile", {
      method: "PATCH",
      body: profileData,
    });

    // Обновляем пользователя в localStorage
    if (response.user) {
      localStorage.setItem("current_user", JSON.stringify(response.user));
    }

    return response;
  }

  // Chat methods
  async sendMessage(messageData) {
    return this.request("/chat/message", {
      method: "POST",
      body: messageData,
    });
  }

  async getMessages(projectId) {
    return this.request(`/chat/${projectId}/messages`);
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("current_user");
    sessionStorage.removeItem("oauthAction");
    sessionStorage.removeItem("oauthProvider");
  }
}

export const apiService = new ApiService();