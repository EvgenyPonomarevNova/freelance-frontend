// contexts/UserContext.jsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { apiService } from "../services/api";

const UserContext = createContext();

// Конфигурация OAuth провайдеров - используем переменные окружения или значения по умолчанию
export const OAUTH_CONFIG = {
  google: {
    clientId: import.meta.env?.REACT_APP_GOOGLE_CLIENT_ID || window.env?.REACT_APP_GOOGLE_CLIENT_ID || "demo-google-client-id",
    scope: 'email profile',
  },
  yandex: {
    clientId: import.meta.env?.REACT_APP_YANDEX_CLIENT_ID || window.env?.REACT_APP_YANDEX_CLIENT_ID || "demo-yandex-client-id",
    authUrl: 'https://oauth.yandex.ru/authorize',
  },
  vk: {
    clientId: import.meta.env?.REACT_APP_VK_CLIENT_ID || window.env?.REACT_APP_VK_CLIENT_ID || "demo-vk-client-id",
    authUrl: 'https://oauth.vk.com/authorize',
    scope: 'email',
  }
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  // Загрузка данных при инициализации
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("current_user");

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        Promise.all([checkAuth(), loadProjects()]).finally(() =>
          setLoading(false)
        );
      } catch (error) {
        console.error("Error parsing saved user:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const response = await apiService.getCurrentUser();
      if (response.user) {
        setUser(response.user);
        localStorage.setItem("current_user", JSON.stringify(response.user));
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      if (error.message.includes("401") || error.message.includes("403")) {
        localStorage.removeItem("token");
        localStorage.removeItem("current_user");
        setUser(null);
      }
    }
  };

  const loadProjects = async () => {
    try {
      const response = await apiService.getProjects();
      if (response.projects) {
        setProjects(response.projects);
      }
    } catch (error) {
      console.error("Error loading projects from API:", error);
      loadProjectsFromStorage();
    }
  };

  const loadProjectsFromStorage = () => {
    try {
      const savedProjects = localStorage.getItem("nexus_projects");
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      }
    } catch (error) {
      console.error("Error loading projects from storage:", error);
    }
  };

  const saveProjectsToStorage = (updatedProjects) => {
    try {
      localStorage.setItem("nexus_projects", JSON.stringify(updatedProjects));
    } catch (error) {
      console.error("Error saving projects to storage:", error);
    }
  };

  // ОСНОВНЫЕ ФУНКЦИИ АУТЕНТИФИКАЦИИ
  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password);
      if (response.user && response.token) {
        setUser(response.user);
        localStorage.setItem("token", response.token);
        localStorage.setItem("current_user", JSON.stringify(response.user));
        return response.user;
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);
      if (response.user && response.token) {
        setUser(response.user);
        localStorage.setItem("token", response.token);
        localStorage.setItem("current_user", JSON.stringify(response.user));
        return response.user;
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      throw error;
    }
  };

  // OAuth авторизация
  const oauthLogin = async (provider, code) => {
    try {
      setLoading(true);
      
      // Для демо-режима, если код не предоставлен
      if (!code || code.startsWith('demo')) {
        return await quickOAuthLogin(provider);
      }
      
      // Реальная OAuth авторизация через API
      const response = await apiService.oauthLogin(provider, code);
      
      if (response.success && response.user && response.token) {
        setUser(response.user);
        localStorage.setItem("token", response.token);
        localStorage.setItem("current_user", JSON.stringify(response.user));
        return { success: true, user: response.user };
      } else {
        throw new Error(response.error || "OAuth authentication failed");
      }
    } catch (error) {
      console.error("OAuth login error:", error);
      return { 
        success: false, 
        error: error.message || "Ошибка OAuth-авторизации" 
      };
    } finally {
      setLoading(false);
    }
  };

  // Получение OAuth URL для редиректа
  const getOAuthUrl = (provider, action = 'login') => {
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

  // Быстрый OAuth вход (для демо и тестирования)
  const quickOAuthLogin = async (provider) => {
    try {
      setLoading(true);
      
      // Демо-пользователи для тестирования
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

      const demoUser = demoUsers[provider];
      
      if (!demoUser) {
        throw new Error('Неизвестный OAuth провайдер');
      }

      // Создаем демо-пользователя
      const mockUser = {
        id: Date.now(),
        email: demoUser.email,
        fullName: demoUser.name,
        role: demoUser.role,
        profile: {
          avatar: null,
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

      setUser(mockUser);
      localStorage.setItem("token", mockToken);
      localStorage.setItem("current_user", JSON.stringify(mockUser));

      return { 
        success: true, 
        user: mockUser,
        isDemo: true 
      };

    } catch (error) {
      console.error("Quick OAuth login error:", error);
      return { 
        success: false, 
        error: error.message 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Очищаем все данные аутентификации
    localStorage.removeItem("token");
    localStorage.removeItem("current_user");
    localStorage.removeItem("oauth_state");
    sessionStorage.removeItem("oauthAction");
    sessionStorage.removeItem("oauthProvider");
    
    setUser(null);
    setProjects([]);
    
    // Вызываем API логаут если нужно
    if (apiService.logout) {
      apiService.logout().catch(console.error);
    }
  };

  // Функции для работы с профилем
const updateProfile = async (profileData) => {
  try {
    console.log('🔄 Updating profile with:', profileData);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Токен авторизации не найден');
    }

    const response = await fetch('/api/users/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData),
    });

    const result = await response.json();
    console.log('📨 Server response:', result);

    if (result.status === 'success') {
      console.log('✅ Server returned success');
      
      // 🔥 ВАЖНО: Обновляем localStorage с данными с сервера
      const updatedUser = result.user;
      console.log('💾 Saving server data to localStorage:', updatedUser);
      
      localStorage.setItem('current_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { 
        success: true, 
        user: updatedUser 
      };
    } else {
      throw new Error(result.message || 'Failed to update profile');
    }

  } catch (error) {
    console.error('❌ Update profile error:', error);
    throw error;
  }
};

  // Функция для связывания OAuth с существующим аккаунтом
  const linkOAuthAccount = async (provider, code) => {
    if (!user) {
      throw new Error("User must be logged in to link OAuth account");
    }

    // Для демо-режима просто обновляем профиль
    if (user.isDemo) {
      const updatedUser = {
        ...user,
        profile: {
          ...user.profile,
          linkedOAuthProviders: [
            ...(user.profile.linkedOAuthProviders || []),
            provider
          ]
        }
      };
      
      setUser(updatedUser);
      localStorage.setItem("current_user", JSON.stringify(updatedUser));
      return { success: true };
    }

    try {
      const response = await apiService.linkOAuthAccount(provider, code);
      
      if (response.success) {
        const updatedUser = {
          ...user,
          profile: {
            ...user.profile,
            linkedOAuthProviders: [
              ...(user.profile.linkedOAuthProviders || []),
              provider
            ]
          }
        };
        
        setUser(updatedUser);
        localStorage.setItem("current_user", JSON.stringify(updatedUser));
        
        return { success: true };
      }
    } catch (error) {
      console.error("Error linking OAuth account:", error);
      throw error;
    }
  };

  // Функция для отвязывания OAuth аккаунта
  const unlinkOAuthAccount = async (provider) => {
    if (!user) {
      throw new Error("User must be logged in to unlink OAuth account");
    }

    // Для демо-режима
    if (user.isDemo) {
      const updatedUser = {
        ...user,
        profile: {
          ...user.profile,
          linkedOAuthProviders: (user.profile.linkedOAuthProviders || [])
            .filter(p => p !== provider)
        }
      };
      
      setUser(updatedUser);
      localStorage.setItem("current_user", JSON.stringify(updatedUser));
      return { success: true };
    }

    try {
      const response = await apiService.unlinkOAuthAccount(provider);
      
      if (response.success) {
        const updatedUser = {
          ...user,
          profile: {
            ...user.profile,
            linkedOAuthProviders: (user.profile.linkedOAuthProviders || [])
              .filter(p => p !== provider)
          }
        };
        
        setUser(updatedUser);
        localStorage.setItem("current_user", JSON.stringify(updatedUser));
        
        return { success: true };
      }
    } catch (error) {
      console.error("Error unlinking OAuth account:", error);
      throw error;
    }
  };

  // Проверка, связан ли OAuth провайдер с аккаунтом
  const isOAuthLinked = (provider) => {
    return user?.profile?.linkedOAuthProviders?.includes(provider) || false;
  };

  // Остальные функции (createProject, getMyProjects, и т.д.) остаются без изменений
  const createProject = useCallback(
    async (projectData) => {
      if (!user) return { success: false, error: "User not authenticated" };

      try {
        // Если есть API и не демо-пользователь
        if (apiService.createProject && !user.isDemo) {
          const response = await apiService.createProject(projectData);
          const newProject = response.project;
          const updatedProjects = [...projects, newProject];
          setProjects(updatedProjects);
          return { success: true, project: newProject };
        } else {
          // Локальное создание для демо-пользователей
          const newProject = {
            id: Date.now(),
            ...projectData,
            client_id: user.id,
            client: {
              id: user.id,
              profile: user.profile,
            },
            status: "open",
            views: 0,
            responses: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const updatedProjects = [...projects, newProject];
          setProjects(updatedProjects);
          saveProjectsToStorage(updatedProjects);
          return { success: true, project: newProject };
        }
      } catch (error) {
        console.error("Error creating project:", error);
        return { success: false, error: error.message };
      }
    },
    [user, projects]
  );

  const getMyProjects = useCallback(async () => {
    if (!user) return [];

    try {
      if (apiService.getMyProjects && !user.isDemo) {
        const response = await apiService.getMyProjects();
        
        if (Array.isArray(response)) {
          return response;
        } else if (response && Array.isArray(response.projects)) {
          return response.projects;
        } else if (response && Array.isArray(response.data)) {
          return response.data;
        } else {
          console.warn("Unexpected response format for my projects:", response);
          return [];
        }
      } else {
        // Локальная фильтрация для демо-пользователей
        const localProjects = Array.isArray(projects)
          ? projects.filter((project) => project.client_id === user.id)
          : [];
        return localProjects;
      }
    } catch (error) {
      console.error("Error getting my projects:", error);
      const localProjects = Array.isArray(projects)
        ? projects.filter((project) => project.client_id === user.id)
        : [];
      return localProjects;
    }
  }, [user, projects]);

  // Остальные функции (getMyResponses, getUserStats, и т.д.)...
  const getMyResponses = useCallback(async () => {
    if (!user || user.role !== "freelancer") return [];

    try {
      if (apiService.getMyResponses && !user.isDemo) {
        const response = await apiService.getMyResponses();
        return response.responses || [];
      } else {
        // Локальная фильтрация для демо-пользователей
        return projects
          .filter((project) =>
            project.responses?.some(
              (response) => response.freelancer_id === user.id
            )
          )
          .map((project) => ({
            project,
            response: project.responses.find((r) => r.freelancer_id === user.id),
          }));
      }
    } catch (error) {
      console.error("Error getting my responses:", error);
      return projects
        .filter((project) =>
          project.responses?.some(
            (response) => response.freelancer_id === user.id
          )
        )
        .map((project) => ({
          project,
          response: project.responses.find((r) => r.freelancer_id === user.id),
        }));
    }
  }, [user, projects]);

  const getUserStats = useCallback(async () => {
    if (!user) return null;

    try {
      const [myProjects, myResponses] = await Promise.all([
        getMyProjects(),
        getMyResponses(),
      ]);

      if (user.role === "client") {
        return {
          totalProjects: myProjects.length,
          activeProjects: myProjects.filter((p) => p.status === "open").length,
          completedProjects: myProjects.filter((p) => p.status === "completed")
            .length,
          totalResponses: myProjects.reduce(
            (acc, project) => acc + (project.responses?.length || 0),
            0
          ),
          rating: user.profile.rating || 5.0,
        };
      } else {
        return {
          completedProjects: user.profile.completedProjects || 0,
          activeResponses: myResponses.filter(
            (r) => r.response?.status === "pending"
          ).length,
          acceptedResponses: myResponses.filter(
            (r) => r.response?.status === "accepted"
          ).length,
          totalResponses: myResponses.length,
          rating: user.profile.rating || 5.0,
        };
      }
    } catch (error) {
      console.error("Error calculating stats:", error);
      return {
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        totalResponses: 0,
        activeResponses: 0,
        acceptedResponses: 0,
        rating: user.profile.rating || 5.0,
      };
    }
  }, [user, getMyProjects, getMyResponses]);

  // Остальные вспомогательные функции...
  const addSkill = useCallback(
    async (skill, level) => {
      if (!user) return;

      const updatedSkills = [...(user.profile.skills || []), { skill, level }];
      const result = await updateProfile({ skills: updatedSkills });

      if (!result.success) {
        throw new Error(result.error);
      }
    },
    [user, updateProfile]
  );

  const removeSkill = useCallback(
    async (skillToRemove) => {
      if (!user) return;

      const updatedSkills =
        user.profile.skills?.filter((s) => s.skill !== skillToRemove) || [];
      const result = await updateProfile({ skills: updatedSkills });

      if (!result.success) {
        throw new Error(result.error);
      }
    },
    [user, updateProfile]
  );

  const addPortfolioItem = useCallback(
    async (item) => {
      if (!user) return;

      const updatedPortfolio = [...(user.profile.portfolio || []), item];
      const result = await updateProfile({ portfolio: updatedPortfolio });

      if (!result.success) {
        throw new Error(result.error);
      }
    },
    [user, updateProfile]
  );

  const removePortfolioItem = useCallback(
    async (itemId) => {
      if (!user) return;

      const updatedPortfolio =
        user.profile.portfolio?.filter((item) => item.id !== itemId) || [];
      const result = await updateProfile({ portfolio: updatedPortfolio });

      if (!result.success) {
        throw new Error(result.error);
      }
    },
    [user, updateProfile]
  );

  const addExperience = useCallback(
    async (experience) => {
      if (!user) return;

      const updatedExperience = [
        ...(user.profile.experienceList || []),
        experience,
      ];
      const result = await updateProfile({ experienceList: updatedExperience });

      if (!result.success) {
        throw new Error(result.error);
      }
    },
    [user, updateProfile]
  );

  const removeExperience = useCallback(
    async (expId) => {
      if (!user) return;

      const updatedExperience =
        user.profile.experienceList?.filter((exp) => exp.id !== expId) || [];
      const result = await updateProfile({ experienceList: updatedExperience });

      if (!result.success) {
        throw new Error(result.error);
      }
    },
    [user, updateProfile]
  );

  const respondToProject = useCallback(
    async (projectId, responseData) => {
      if (!user || user.role !== "freelancer") {
        return {
          success: false,
          error: "Only freelancers can respond to projects",
        };
      }

      try {
        if (apiService.respondToProject && !user.isDemo) {
          const response = await apiService.respondToProject(
            projectId,
            responseData
          );
          return { success: true, response: response.response };
        } else {
          // Локальный отклик для демо-пользователей
          const projectIndex = projects.findIndex((p) => p.id === projectId);
          if (projectIndex === -1) {
            return { success: false, error: "Project not found" };
          }

          const project = projects[projectIndex];
          const existingResponse = project.responses?.find(
            (response) => response.freelancer_id === user.id
          );

          if (existingResponse) {
            return {
              success: false,
              error: "You have already responded to this project",
            };
          }

          const newResponse = {
            id: Date.now(),
            freelancer_id: user.id,
            freelancer: {
              id: user.id,
              profile: user.profile,
            },
            ...responseData,
            status: "pending",
            created_at: new Date().toISOString(),
          };

          const updatedProject = {
            ...project,
            responses: [...(project.responses || []), newResponse],
          };

          const updatedProjects = [...projects];
          updatedProjects[projectIndex] = updatedProject;

          setProjects(updatedProjects);
          saveProjectsToStorage(updatedProjects);

          return { success: true, response: newResponse };
        }
      } catch (error) {
        console.error("Error responding to project:", error);
        return { success: false, error: error.message };
      }
    },
    [user, projects]
  );

  const updateResponseStatus = useCallback(
    async (projectId, responseId, status) => {
      if (!user) return { success: false, error: "User not authenticated" };

      try {
        if (apiService.updateResponseStatus && !user.isDemo) {
          const response = await apiService.updateResponseStatus(
            projectId,
            responseId,
            status
          );
          return { success: true, response: response.response };
        } else {
          // Локальное обновление для демо-пользователей
          const projectIndex = projects.findIndex((p) => p.id === projectId);
          if (projectIndex === -1) {
            return { success: false, error: "Project not found" };
          }

          const project = projects[projectIndex];
          const responseIndex = project.responses?.findIndex(
            (r) => r.id === responseId
          );

          if (responseIndex === -1) {
            return { success: false, error: "Response not found" };
          }

          const updatedProject = {
            ...project,
            responses: project.responses.map((r, idx) =>
              idx === responseIndex ? { ...r, status } : r
            ),
          };

          if (status === "accepted") {
            updatedProject.status = "in_progress";
          }

          const updatedProjects = [...projects];
          updatedProjects[projectIndex] = updatedProject;

          setProjects(updatedProjects);
          saveProjectsToStorage(updatedProjects);

          return {
            success: true,
            response: updatedProject.responses[responseIndex],
          };
        }
      } catch (error) {
        console.error("Error updating response status:", error);
        return { success: false, error: error.message };
      }
    },
    [projects]
  );

  const value = {
    // Основные функции аутентификации
    user,
    loading,
    login,
    register,
    logout,

    // OAuth функции
    oauthLogin,
    getOAuthUrl,
    quickOAuthLogin,
    linkOAuthAccount,
    unlinkOAuthAccount,
    isOAuthLinked,

    // Функции профиля
    updateProfile,
    addSkill,
    removeSkill,
    addPortfolioItem,
    removePortfolioItem,
    addExperience,
    removeExperience,

    // Функции проектов
    projects,
    createProject,
    getMyProjects,
    getMyResponses,
    getUserStats,
    respondToProject,
    updateResponseStatus,

    // Вспомогательные функции
    setUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};