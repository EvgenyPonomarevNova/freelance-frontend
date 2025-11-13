// src/contexts/UserContext.jsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const UserContext = createContext();

// 🔥 Базовый URL API
const API_BASE_URL = 'http://localhost:3001';

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  // 🔥 ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ API
  const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}: ${errorText}`);
    }

    return response.json();
  };

  // 🔥 ОСНОВНЫЕ ФУНКЦИИ API
  const apiService = {
    // Аутентификация
    login: async (email, password) => {
      return apiRequest('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      });
    },

    register: async (userData) => {
      return apiRequest('/api/auth/register', {
        method: 'POST',
        body: userData
      });
    },

    getCurrentUser: async () => {
      return apiRequest('/api/users/profile');
    },

    // OAuth
    oauthLogin: async (provider, code) => {
      return apiRequest(`/api/auth/oauth/${provider}/login`, {
        method: 'POST',
        body: { code }
      });
    },

    // Профиль
    updateProfile: async (profileData) => {
      return apiRequest('/api/users/profile', {
        method: 'PATCH',
        body: profileData
      });
    },

    // Проекты
    getProjects: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiRequest(`/api/projects?${queryString}`);
    },

    getMyProjects: async () => {
      return apiRequest('/api/projects/client/my-projects');
    },

    createProject: async (projectData) => {
      return apiRequest('/api/projects', {
        method: 'POST',
        body: projectData
      });
    },

    // Отклики
    getMyResponses: async () => {
      return apiRequest('/api/projects/my/responses');
    },

    respondToProject: async (projectId, responseData) => {
      return apiRequest(`/api/projects/${projectId}/respond`, {
        method: 'POST',
        body: responseData
      });
    },

    updateResponse: async (responseId, updates) => {
      return apiRequest(`/api/projects/responses/${responseId}`, {
        method: 'PATCH',
        body: updates
      });
    }
  };

  // 🔥 ПРОЕКТЫ - ПЕРЕНЕСЕМ ЭТИ ФУНКЦИИ В НАЧАЛО
  const getMyProjects = useCallback(async () => {
    if (!user) return [];

    try {
      const response = await apiService.getMyProjects();
      return response.data || response.projects || [];
    } catch (error) {
      console.error('Error getting projects:', error);
      return [];
    }
  }, [user]);

  const createProject = useCallback(async (projectData) => {
    if (!user) throw new Error('Пользователь не авторизован');

    try {
      const result = await apiService.createProject(projectData);
      
      if (result.success) {
        const newProject = result.data || result.project;
        const updatedProjects = [...projects, newProject];
        setProjects(updatedProjects);
        return { success: true, project: newProject };
      } else {
        throw new Error(result.error || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }, [user, projects]);

  // 🔥 ОТКЛИКИ
  const getMyResponses = useCallback(async () => {
    if (!user) return [];

    try {
      const response = await apiService.getMyResponses();
      return response.data || response.responses || [];
    } catch (error) {
      console.error('Error getting responses:', error);
      
      // 🔥 РЕЗЕРВНЫЙ ВАРИАНТ - данные из localStorage
      const savedUser = localStorage.getItem('current_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        return userData.profile?.responses || [];
      }
      
      return [];
    }
  }, [user]);

  const updateResponse = useCallback(async (responseId, updates) => {
    if (!user) throw new Error('Пользователь не авторизован');

    try {
      const result = await apiService.updateResponse(responseId, updates);
      
      if (result.success) {
        // 🔥 ОБНОВЛЯЕМ ЛОКАЛЬНЫЕ ДАННЫЕ
        const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
        const updatedResponses = (currentUser.profile?.responses || []).map(response => 
          response.id === responseId ? { ...response, ...updates } : response
        );
        
        const updatedUser = {
          ...currentUser,
          profile: {
            ...currentUser.profile,
            responses: updatedResponses
          }
        };
        
        localStorage.setItem('current_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        return { success: true, response: result.data };
      } else {
        throw new Error(result.error || 'Failed to update response');
      }
    } catch (error) {
      console.error('Error updating response:', error);
      throw error;
    }
  }, [user]);

  // 🔥 СТАТИСТИКА ПОЛЬЗОВАТЕЛЯ
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
          completedProjects: myProjects.filter((p) => p.status === "completed").length,
          totalResponses: myProjects.reduce((acc, project) => acc + (project.responses?.length || 0), 0),
          rating: user.profile?.rating || 5.0,
        };
      } else {
        const responses = Array.isArray(myResponses) ? myResponses : [];
        return {
          completedProjects: user.profile?.completedProjects || 0,
          activeResponses: responses.filter((r) => r.status === "pending").length,
          acceptedResponses: responses.filter((r) => r.status === "accepted").length,
          totalResponses: responses.length,
          rating: user.profile?.rating || 5.0,
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
        rating: user.profile?.rating || 5.0,
      };
    }
  }, [user, getMyProjects, getMyResponses]);

  // 🔥 ФУНКЦИИ ДЛЯ РАБОТЫ С ПРОФИЛЕМ
const updateProfile = useCallback(async (profileData) => {
  try {
    console.log('🔄 Updating profile with:', profileData);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Токен авторизации не найден');
    }

    // 🔥 ПРЕОБРАЗУЕМ И ВАЛИДИРУЕМ ДАННЫЕ ДЛЯ СЕРВЕРА
    const processedData = {
      name: profileData.name || user?.profile?.name || 'Пользователь',
      title: profileData.title || user?.profile?.title || '',
      bio: profileData.bio || user?.profile?.bio || '',
      location: profileData.location || user?.profile?.location || '',
      hourlyRate: profileData.hourlyRate ? Number(profileData.hourlyRate) : user?.profile?.hourlyRate || 0,
      experience: profileData.experience || user?.profile?.experience || '',
      website: profileData.website || user?.profile?.website || '',
      telegram: profileData.telegram || user?.profile?.telegram || '',
      github: profileData.github || user?.profile?.github || '',
      avatar: profileData.avatar || user?.profile?.avatar || '',
      category: profileData.category || user?.profile?.category || 'other',
      skills: Array.isArray(profileData.skills) ? profileData.skills : user?.profile?.skills || [],
      portfolio: Array.isArray(profileData.portfolio) ? profileData.portfolio : user?.profile?.portfolio || [],
      experienceList: Array.isArray(profileData.experienceList) ? profileData.experienceList : user?.profile?.experienceList || [],
    };

    // 🔥 УДАЛЯЕМ ПУСТЫЕ СТРОКИ И НУЛЕВЫЕ ЗНАЧЕНИЯ
    Object.keys(processedData).forEach(key => {
      if (processedData[key] === '' || processedData[key] === null || processedData[key] === undefined) {
        delete processedData[key];
      }
    });

    console.log('📤 Sending processed data:', processedData);

    const result = await apiService.updateProfile(processedData);
    console.log('📨 Server response:', result);

    if (result.success) {
      console.log('✅ Profile updated successfully');
      
      const updatedUser = result.data || result.user;
      if (updatedUser) {
        // 🔥 ОБНОВЛЯЕМ ЛОКАЛЬНЫЕ ДАННЫЕ
        const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
        const mergedUser = {
          ...currentUser,
          ...updatedUser,
          profile: {
            ...currentUser.profile,
            ...updatedUser.profile,
            ...processedData // Сохраняем все отправленные данные
          }
        };
        
        console.log('💾 Saving merged user data:', mergedUser);
        localStorage.setItem('current_user', JSON.stringify(mergedUser));
        setUser(mergedUser);
      }
      
      return { 
        success: true, 
        user: updatedUser,
        message: result.message 
      };
    } else {
      throw new Error(result.error || 'Failed to update profile');
    }

  } catch (error) {
    console.error('❌ Update profile error:', error);
    throw error;
  }
}, [user]);

  const addSkill = useCallback(async (skill, level = 'intermediate') => {
    if (!user) throw new Error('Пользователь не авторизован');

    try {
      const currentSkills = user.profile?.skills || [];
      const updatedSkills = [...currentSkills, { skill, level }];
      
      const result = await updateProfile({ skills: updatedSkills });
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result;
    } catch (error) {
      console.error('Error adding skill:', error);
      throw error;
    }
  }, [user, updateProfile]);

  const removeSkill = useCallback(async (skillToRemove) => {
    if (!user) throw new Error('Пользователь не авторизован');

    try {
      const currentSkills = user.profile?.skills || [];
      const updatedSkills = currentSkills.filter(s => s.skill !== skillToRemove);
      
      const result = await updateProfile({ skills: updatedSkills });
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result;
    } catch (error) {
      console.error('Error removing skill:', error);
      throw error;
    }
  }, [user, updateProfile]);

  const addPortfolioItem = useCallback(async (item) => {
    if (!user) throw new Error('Пользователь не авторизован');

    try {
      const currentPortfolio = user.profile?.portfolio || [];
      const updatedPortfolio = [...currentPortfolio, item];
      
      const result = await updateProfile({ portfolio: updatedPortfolio });
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result;
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      throw error;
    }
  }, [user, updateProfile]);

  const removePortfolioItem = useCallback(async (itemId) => {
    if (!user) throw new Error('Пользователь не авторизован');

    try {
      const currentPortfolio = user.profile?.portfolio || [];
      const updatedPortfolio = currentPortfolio.filter(item => item.id !== itemId);
      
      const result = await updateProfile({ portfolio: updatedPortfolio });
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result;
    } catch (error) {
      console.error('Error removing portfolio item:', error);
      throw error;
    }
  }, [user, updateProfile]);

  const addExperience = useCallback(async (experience) => {
    if (!user) throw new Error('Пользователь не авторизован');

    try {
      const currentExperience = user.profile?.experienceList || [];
      const updatedExperience = [...currentExperience, experience];
      
      const result = await updateProfile({ experienceList: updatedExperience });
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result;
    } catch (error) {
      console.error('Error adding experience:', error);
      throw error;
    }
  }, [user, updateProfile]);

  const removeExperience = useCallback(async (expId) => {
    if (!user) throw new Error('Пользователь не авторизован');

    try {
      const currentExperience = user.profile?.experienceList || [];
      const updatedExperience = currentExperience.filter(exp => exp.id !== expId);
      
      const result = await updateProfile({ experienceList: updatedExperience });
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result;
    } catch (error) {
      console.error('Error removing experience:', error);
      throw error;
    }
  }, [user, updateProfile]);

  // 🔥 АУТЕНТИФИКАЦИЯ
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

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("current_user");
    setUser(null);
    setProjects([]);
  };

  // 🔥 OAuth функции (упрощенные)
  const oauthLogin = async (provider, code) => {
    try {
      const response = await apiService.oauthLogin(provider, code);
      
      if (response.user && response.token) {
        setUser(response.user);
        localStorage.setItem("token", response.token);
        localStorage.setItem("current_user", JSON.stringify(response.user));
        return { 
          success: true, 
          user: response.user,
          isDemo: response.isDemo || false 
        };
      }
      
      throw new Error("Invalid OAuth response");
    } catch (error) {
      console.error("OAuth login error:", error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  const getOAuthUrl = (provider) => {
    // 🔥 ЗАМЕНИТЕ НА ВАШИ REAL OAUTH URLS
    const urls = {
      yandex: `${API_BASE_URL}/api/auth/oauth/yandex`,
      google: `${API_BASE_URL}/api/auth/oauth/google`, 
      vk: `${API_BASE_URL}/api/auth/oauth/vk`
    };
    return urls[provider] || `${API_BASE_URL}/api/auth/oauth/${provider}`;
  };

  // 🔥 ЗАГРУЗКА ДАННЫХ ПРИ ЗАПУСКЕ
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("current_user");

        if (token && savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          
          // Проверяем актуальность токена
          try {
            const currentUser = await apiService.getCurrentUser();
            if (currentUser.user) {
              setUser(currentUser.user);
              localStorage.setItem("current_user", JSON.stringify(currentUser.user));
            }
          } catch (error) {
            console.log('Token might be expired, keeping local user data');
          }
        }
      } catch (error) {
        console.error("Error initializing user:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  const value = {
    // Основные данные
    user,
    loading,
    
    // Аутентификация
    login,
    register,
    logout,

    // OAuth
    oauthLogin,
    getOAuthUrl,

    // Профиль
    updateProfile,
    addSkill,
    removeSkill,
    addPortfolioItem,
    removePortfolioItem,
    addExperience,
    removeExperience,

    // Проекты и отклики
    projects,
    createProject,
    getMyProjects,
    getMyResponses,
    getUserStats,
    updateResponse,

    // Вспомогательные
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