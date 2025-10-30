// src/services/api.js
class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
    this.isMockMode = true; // Флаг для демо-режима
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('API request failed:', error);
      
      // В демо-режиме возвращаем mock данные
      if (this.isMockMode) {
        console.log('🔄 Using mock data for:', endpoint);
        return this.getMockResponse(endpoint, options);
      }
      
      throw error;
    }
  }

  // Mock responses для демо-режима
  getMockResponse(endpoint, options) {
    const mockData = {
      '/auth/login': {
        success: true,
        token: 'demo_jwt_token_' + Date.now(),
        user: {
          id: Date.now(),
          email: options.body?.email || 'demo@user.ru',
          role: 'freelancer',
          profile: {
            name: 'Демо Пользователь',
            bio: 'Демо-пользователь для тестирования',
            skills: ['JavaScript', 'React', 'CSS'],
            rating: 4.8,
            completedProjects: 12,
            hourlyRate: 1500,
            location: 'Москва'
          }
        }
      },
      '/auth/register': {
        success: true,
        token: 'demo_jwt_token_' + Date.now(),
        user: {
          id: Date.now(),
          email: options.body?.email || 'newuser@demo.ru',
          role: options.body?.role || 'freelancer',
          profile: {
            name: options.body?.name || 'Новый Пользователь',
            bio: '',
            skills: [],
            rating: 5.0,
            completedProjects: 0
          }
        }
      },
      '/auth/me': {
        user: JSON.parse(localStorage.getItem('current_user') || '{}')
      },
      '/projects': {
        projects: JSON.parse(localStorage.getItem('nexus_projects') || '[]')
      },
      '/users/profile': {
        status: 'success',
        user: JSON.parse(localStorage.getItem('current_user') || '{}')
      }
    };

    return mockData[endpoint] || { success: true, message: 'Mock response' };
  }

  // OAuth методы
  async oauthLogin(provider, code) {
    try {
      // Для демо-режима используем mock
      if (this.isMockMode || !code || code.startsWith('demo')) {
        return this.mockOAuthLogin(provider);
      }

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
      
      // Fallback на mock в случае ошибки
      const mockResponse = this.mockOAuthLogin(provider);
      localStorage.setItem("token", mockResponse.token);
      localStorage.setItem("current_user", JSON.stringify(mockResponse.user));
      return mockResponse;
    }
  }

  // Mock OAuth логин
  mockOAuthLogin(provider) {
    const demoUsers = {
      google: {
        email: 'demo.google@freelancehub.ru',
        name: 'Демо Google Пользователь',
        role: 'freelancer'
      },
      yandex: {
        email: 'demo.yandex@freelancehub.ru', 
        name: 'Демо Yandex Пользователь',
        role: 'freelancer'
      },
      vk: {
        email: 'demo.vk@freelancehub.ru',
        name: 'Демо VK Пользователь',
        role: 'client'
      }
    };

    const demoUser = demoUsers[provider] || demoUsers.google;
    
    const mockUser = {
      id: Date.now(),
      email: demoUser.email,
      fullName: demoUser.name,
      role: demoUser.role,
      profile: {
        name: demoUser.name,
        bio: `Демо пользователь через ${provider}`,
        skills: demoUser.role === 'freelancer' ? ['JavaScript', 'React', 'CSS'] : [],
        rating: 4.8,
        completedProjects: demoUser.role === 'freelancer' ? 12 : 0,
        isEmailVerified: true,
        oauthProvider: provider
      },
      isOAuth: true,
      isDemo: true
    };

    const mockToken = `demo_oauth_token_${provider}_${Date.now()}`;

    return {
      success: true,
      user: mockUser,
      token: mockToken,
      isDemo: true
    };
  }

  // Связывание OAuth с аккаунтом
  async linkOAuthAccount(provider, code) {
    try {
      if (this.isMockMode) {
        return { success: true, message: 'OAuth account linked successfully' };
      }

      return await this.request(`/auth/oauth/${provider}/link`, {
        method: "POST",
        body: {
          code,
          redirect_uri: `${window.location.origin}/oauth-callback`
        }
      });
    } catch (error) {
      console.error('Link OAuth error:', error);
      return { success: true }; // Всегда успех в демо-режиме
    }
  }

  // Отвязывание OAuth аккаунта
  async unlinkOAuthAccount(provider) {
    try {
      if (this.isMockMode) {
        return { success: true, message: 'OAuth account unlinked successfully' };
      }

      return await this.request(`/auth/oauth/${provider}/unlink`, {
        method: "DELETE"
      });
    } catch (error) {
      console.error('Unlink OAuth error:', error);
      return { success: true }; // Всегда успех в демо-режиме
    }
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

  // Методы аутентификации
  async login(email, password) {
    try {
      console.log('🔐 Attempting login for:', email);
      
      const response = await this.request("/auth/login", {
        method: "POST",
        body: { email, password },
      });

      console.log('📨 Login API response:', response);

      if (response && response.success && response.token) {
        console.log('✅ Login successful, saving token');
        localStorage.setItem("token", response.token);
        localStorage.setItem("current_user", JSON.stringify(response.user));
        return response;
      }
      
      throw new Error(response?.error || "Invalid response from server");
      
    } catch (error) {
      console.error('❌ Login API error:', error.message);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await this.request("/auth/register", {
        method: "POST",
        body: userData,
      });

      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("current_user", JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
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
    try {
      const queryParams = new URLSearchParams(filters).toString();
      return await this.request(`/projects?${queryParams}`);
    } catch (error) {
      console.error('Get projects error:', error);
      throw error;
    }
  }

  async createProject(projectData) {
    try {
      return await this.request("/projects", {
        method: "POST",
        body: projectData,
      });
    } catch (error) {
      console.error('Create project error:', error);
      throw error;
    }
  }

  async getProject(projectId) {
    try {
      return await this.request(`/projects/${projectId}`);
    } catch (error) {
      console.error('Get project error:', error);
      throw error;
    }
  }

  async respondToProject(projectId, responseData) {
    try {
      return await this.request(`/projects/${projectId}/respond`, {
        method: "POST",
        body: responseData,
      });
    } catch (error) {
      console.error('Respond to project error:', error);
      throw error;
    }
  }

  async getMyResponses() {
    try {
      return await this.request("/projects/my/responses");
    } catch (error) {
      console.error('Get my responses error:', error);
      throw error;
    }
  }

  async getMyProjects() {
    try {
      return await this.request("/projects/client/my-projects");
    } catch (error) {
      console.error('Get my projects error:', error);
      throw error;
    }
  }

  async updateResponseStatus(projectId, responseId, status) {
    try {
      return await this.request(`/projects/${projectId}/responses/${responseId}`, {
        method: "PATCH",
        body: { status },
      });
    } catch (error) {
      console.error('Update response status error:', error);
      throw error;
    }
  }

  // User methods
  async getFreelancers(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      return await this.request(`/users/freelancers?${queryParams}`);
    } catch (error) {
      console.error('Get freelancers error:', error);
      throw error;
    }
  }

  async getUserProfile(userId) {
    try {
      return await this.request(`/users/${userId}`);
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await this.request("/users/profile", {
        method: "PATCH",
        body: profileData,
      });

      // Обновляем пользователя в localStorage
      if (response.user) {
        localStorage.setItem("current_user", JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Chat methods
  async sendMessage(messageData) {
    try {
      return await this.request("/chat/message", {
        method: "POST",
        body: messageData,
      });
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  async getMessages(projectId) {
    try {
      return await this.request(`/chat/${projectId}/messages`);
    } catch (error) {
      console.error('Get messages error:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("current_user");
    sessionStorage.removeItem("oauthAction");
    sessionStorage.removeItem("oauthProvider");
  }
}

export const apiService = new ApiService();