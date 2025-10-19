import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка пользователя из localStorage при загрузке приложения
  useEffect(() => {
    const savedUser = localStorage.getItem("freelanceHub_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Регистрация нового пользователя
  const register = (userData) => {
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      profile: {
        name: userData.fullName,
        title: "",
        description: "",
        hourlyRate: userData.role === "freelancer" ? 0 : null,
        location: "",
        experience: "", // опыт работы (строка)
        completedProjects: 0,
        rating: 0,
        avatar: null,
        skills: [], // массив навыков
        portfolio: [], // массив проектов портфолио
        experienceList: [], // массив мест работы (переименовал)
      },
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    localStorage.setItem("freelanceHub_user", JSON.stringify(newUser));
    return newUser;
  };

  // Вход пользователя (пока просто сохраняем)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("freelanceHub_user", JSON.stringify(userData));
  };

  // Выход
  const logout = () => {
    setUser(null);
    localStorage.removeItem("freelanceHub_user");
  };

  // Обновление профиля
  const updateProfile = (profileData) => {
    const updatedUser = {
      ...user,
      profile: {
        ...user.profile,
        ...profileData,
      },
    };
    setUser(updatedUser);
    localStorage.setItem("freelanceHub_user", JSON.stringify(updatedUser));
  };

  // Добавление навыка
  const addSkill = (skill, level) => {
    const updatedUser = {
      ...user,
      profile: {
        ...user.profile,
        skills: [...user.profile.skills, { skill, level }],
      },
    };
    setUser(updatedUser);
    localStorage.setItem("freelanceHub_user", JSON.stringify(updatedUser));
  };

  // Удаление навыка
  const removeSkill = (skillToRemove) => {
    const updatedUser = {
      ...user,
      profile: {
        ...user.profile,
        skills: user.profile.skills.filter((s) => s.skill !== skillToRemove),
      },
    };
    setUser(updatedUser);
    localStorage.setItem("freelanceHub_user", JSON.stringify(updatedUser));
  };

  // Добавление проекта в портфолио
  const addPortfolioItem = (item) => {
    const newItem = {
      id: Date.now().toString(),
      ...item,
    };
    const updatedUser = {
      ...user,
      profile: {
        ...user.profile,
        portfolio: [...user.profile.portfolio, newItem],
      },
    };
    setUser(updatedUser);
    localStorage.setItem("freelanceHub_user", JSON.stringify(updatedUser));
  };

  // Удаление проекта из портфолио
  const removePortfolioItem = (itemId) => {
    const updatedUser = {
      ...user,
      profile: {
        ...user.profile,
        portfolio: user.profile.portfolio.filter((item) => item.id !== itemId),
      },
    };
    setUser(updatedUser);
    localStorage.setItem("freelanceHub_user", JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isLoading,
    register,
    login,
    logout,
    updateProfile,
    addSkill,
    removeSkill,
    addPortfolioItem,
    removePortfolioItem,
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
