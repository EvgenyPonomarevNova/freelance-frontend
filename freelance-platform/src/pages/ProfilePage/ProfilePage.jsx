// pages/ProfilePage/ProfilePage.jsx
import "./ProfilePage.scss";
import { useState, useEffect, useRef } from "react";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import SkillTag from "../../components/SkillTag/SkillTag";
import PortfolioItem from "../../components/PortfolioItem/PortfolioItem";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import EmptyState from "../../components/UI/EmptyState";

// Константы для унификации структуры данных
const PROFILE_DATA_SCHEMA = {
  name: "",
  title: "",
  bio: "",
  hourlyRate: "",
  location: "",
  experience: "",
  website: "",
  telegram: "",
  github: "",
};

const SKILL_LEVELS = [
  { value: "beginner", label: "Начальный" },
  { value: "intermediate", label: "Средний" },
  { value: "advanced", label: "Продвинутый" },
  { value: "expert", label: "Эксперт" }
];

// Умные подсказки для городов
const CITY_SUGGESTIONS = [
  "Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург", "Казань",
  "Нижний Новгород", "Челябинск", "Самара", "Омск", "Ростов-на-Дону",
  "Уфа", "Красноярск", "Воронеж", "Пермь", "Волгоград"
];

// Умные подсказки для навыков по специализациям
const SKILL_SUGGESTIONS = {
  development: ["JavaScript", "TypeScript", "React", "Vue", "Angular", "Node.js", "Python", "PHP", "Java", "C#", "HTML", "CSS", "SASS", "Webpack", "Git"],
  design: ["Figma", "Adobe Photoshop", "Adobe Illustrator", "UI/UX Design", "Web Design", "Mobile Design", "Prototyping", "Wireframing", "Sketch", "InVision"],
  marketing: ["SEO", "SMM", "Контекстная реклама", "Аналитика", "Google Analytics", "Email маркетинг", "Копирайтинг", "Таргетинг", "Content Marketing"],
  writing: ["Копирайтинг", "Рерайтинг", "SEO-тексты", "Статьи", "Блоги", "Технический текст", "Редактура", "Корректура"],
  seo: ["Поисковая оптимизация", "Аналитика", "Семантика", "Ссылочная масса", "Технический SEO", "Google Analytics", "Яндекс.Метрика"],
  other: ["Проектирование", "Анализ", "Управление", "Коммуникация", "Презентации", "Переговоры"]
};

function ProfilePage() {
  const {
    user,
    loading,
    updateProfile,
    getMyProjects,
    getUserStats,
    addSkill,
    removeSkill,
    addPortfolioItem,
    removePortfolioItem,
    addExperience,
    removeExperience,
    getMyResponses,
    updateResponse
  } = useUser();

  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Состояния компонента
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("skills");
  const [stats, setStats] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [profileData, setProfileData] = useState(PROFILE_DATA_SCHEMA);
  const [newSkill, setNewSkill] = useState("");
  const [skillLevel, setSkillLevel] = useState("intermediate");
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    title: "",
    description: "",
    skills: [],
    link: "",
    image: "",
    projectImages: [],
    duration: "",
    budget: "",
    category: "development"
  });
  const [newExperience, setNewExperience] = useState({
    position: "",
    company: "",
    period: "",
    description: "",
    startDate: "",
    endDate: "",
    current: false
  });
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [myResponses, setMyResponses] = useState([]);
  const [editingResponse, setEditingResponse] = useState(null);

  // Загрузка статистики пользователя и откликов
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          const [userStats, responses] = await Promise.all([
            getUserStats(),
            getMyResponses()
          ]);
          setStats(userStats);
          setMyResponses(responses || []);
        } catch (error) {
          console.error("Error loading data:", error);
        }
      }
    };

    loadData();
  }, [user, getUserStats, getMyResponses]);

  // Инициализация данных профиля
  useEffect(() => {
    if (user) {
      console.log('👤 Current user data:', user);
      console.log('👤 User profile data:', user.profile);

      const userData = {
        name: user.profile?.name || user.name || "",
        title: user.profile?.title || "",
        bio: user.profile?.bio || "",
        hourlyRate: user.profile?.hourlyRate || "",
        location: user.profile?.location || "",
        experience: user.profile?.experience || "",
        website: user.profile?.website || "",
        telegram: user.profile?.telegram || "",
        github: user.profile?.github || "",
      };

      console.log('📝 Initializing profile data:', userData);
      setProfileData(userData);

      if (user.profile?.avatar) {
        console.log('🖼️ Setting avatar from user profile:', user.profile.avatar);
        setAvatarPreview(user.profile.avatar);
      } else {
        setAvatarPreview(null);
      }
    }
  }, [user]);

  // 🔥 ИСПРАВЛЕННАЯ ФУНКЦИЯ ЗАГРУЗКИ АВАТАРА
  const handleAvatarUpload = async (file) => {
    try {
      console.log('🚀 handleAvatarUpload called with file:', file);
      console.log('📁 File details:', {
        name: file?.name,
        size: file?.size,
        type: file?.type,
        isFile: file instanceof File,
        isBlob: file instanceof Blob
      });
      
      // Конвертируем файл в base64
      const base64Avatar = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          console.log('✅ File converted to base64, length:', reader.result.length);
          resolve(reader.result);
        };
        reader.onerror = error => {
          console.error('❌ FileReader error:', error);
          reject(error);
        };
        reader.readAsDataURL(file);
      });

      console.log('🔐 Getting token...');
      const token = localStorage.getItem('token');
      console.log('🔑 Token exists:', !!token);
      
      console.log('📨 Sending request to server...');
      const response = await fetch('http://localhost:3001/api/users/profile/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatarData: base64Avatar
        }),
      });

      console.log('📨 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Server success response:', result);
      
      if (result.success) {
        console.log('🎉 Avatar uploaded successfully!');
        return result.avatarUrl;
      } else {
        throw new Error(result.error || 'Failed to upload avatar');
      }
    } catch (error) {
      console.error('💥 Avatar upload error:', error);
      throw error;
    }
  };

  // 🔥 ИСПРАВЛЕННАЯ ФУНКЦИЯ ОБРАБОТКИ ИЗМЕНЕНИЯ АВАТАРА
  const handleAvatarChange = (event) => {
    console.log('🔄 Avatar change event fired');
    console.log('🎯 Event target:', event.target);
    console.log('📁 Files:', event.target.files);
    
    const file = event.target.files[0];
    console.log('📁 Selected file:', file);
    
    if (file) {
      // Проверяем размер файла (максимум 2MB для base64)
      if (file.size > 2 * 1024 * 1024) {
        alert('Файл слишком большой. Максимальный размер: 2MB');
        return;
      }

      // Проверяем тип файла
      if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите изображение');
        return;
      }

      console.log('✅ File is valid, starting upload...');

      // Сразу показываем превью
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          console.log('🖼️ Setting avatar preview');
          setAvatarPreview(e.target.result);
          
          console.log('📤 Starting file upload...');
          const avatarUrl = await handleAvatarUpload(file);
          
          console.log('✅ Upload successful, updating profile...');
          // Обновляем профиль с новым аватаром
          await updateProfile({ avatar: avatarUrl });
          
        } catch (error) {
          console.error('❌ Error in avatar change:', error);
          alert('Ошибка при загрузке аватара: ' + error.message);
        }
      };
      
      reader.onerror = (error) => {
        console.error('❌ FileReader error:', error);
        alert('Ошибка при чтении файла');
      };
      
      reader.readAsDataURL(file);
    } else {
      console.error('❌ No file selected or file is invalid');
    }
  };

  const triggerAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Умные подсказки для города
    if (name === 'location') {
      const filteredCities = CITY_SUGGESTIONS.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setCitySuggestions(filteredCities);
    }
  };

  const handleCitySelect = (city) => {
    setProfileData(prev => ({ ...prev, location: city }));
    setCitySuggestions([]);
  };

  const handleSkillInputChange = (value) => {
    setNewSkill(value);
    
    // Умные подсказки для навыков
    const category = profileData.title?.toLowerCase() || 'development';
    const categoryKey = Object.keys(SKILL_SUGGESTIONS).find(key => 
      category.includes(key)
    ) || 'development';
    
    const filteredSkills = SKILL_SUGGESTIONS[categoryKey].filter(skill =>
      skill.toLowerCase().includes(value.toLowerCase())
    );
    setSkillSuggestions(filteredSkills);
  };

  const handleSkillSelect = (skill) => {
    setNewSkill(skill);
    setSkillSuggestions([]);
  };

  const saveProfile = async () => {
    try {
      setSaveLoading(true);
      
      const dataToSave = {
        name: profileData.name,
        bio: profileData.bio,
        location: profileData.location,
        title: profileData.title,
        hourlyRate: profileData.hourlyRate,
        experience: profileData.experience,
        website: profileData.website,
        telegram: profileData.telegram,
        github: profileData.github,
      };

      console.log('📤 Saving profile data:', dataToSave);
      
      const result = await updateProfile(dataToSave);
      console.log('✅ Final save result:', result);

      setIsEditing(false);
      
      const savedUser = localStorage.getItem('current_user');
      console.log('💾 Current localStorage:', JSON.parse(savedUser));
      
      alert('Профиль успешно обновлен!');
      
      const updatedStats = await getUserStats();
      setStats(updatedStats);

    } catch (error) {
      console.error('❌ Save error:', error);
      alert('Ошибка при сохранении профиля: ' + error.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const cancelEdit = () => {
    if (user) {
      setProfileData({
        name: user.name || user.profile?.name || "",
        title: user.title || user.profile?.title || "",
        bio: user.bio || user.profile?.bio || "",
        hourlyRate: user.hourlyRate || user.profile?.hourlyRate || "",
        location: user.location || user.profile?.location || "",
        experience: user.experience || user.profile?.experience || "",
        website: user.website || user.profile?.website || "",
        telegram: user.telegram || user.profile?.telegram || "",
        github: user.github || user.profile?.github || "",
      });
    }
    setIsEditing(false);
  };

  const addNewSkill = () => {
    if (newSkill.trim() && !user.profile.skills?.find((s) => s.skill === newSkill.trim())) {
      addSkill(newSkill.trim(), skillLevel);
      setNewSkill("");
      setSkillSuggestions([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addNewSkill();
    }
  };

  const handleAddPortfolio = async () => {
    if (newPortfolioItem.title.trim() && newPortfolioItem.description.trim()) {
      try {
        await addPortfolioItem({
          ...newPortfolioItem,
          id: Date.now(),
          date: new Date().toLocaleDateString("ru-RU", {
            month: "long",
            year: "numeric",
          }),
        });
        setNewPortfolioItem({
          title: "",
          description: "",
          skills: [],
          link: "",
          image: "",
          projectImages: [],
          duration: "",
          budget: "",
          category: "development"
        });
        setShowPortfolioForm(false);
        alert('Проект добавлен в портфолио!');
      } catch (error) {
        alert('Ошибка при добавлении проекта: ' + error.message);
      }
    }
  };

  const handleAddExperience = async () => {
    if (newExperience.position.trim() && newExperience.company.trim()) {
      try {
        await addExperience({
          ...newExperience,
          id: Date.now(),
        });
        setNewExperience({
          position: "",
          company: "",
          period: "",
          description: "",
          startDate: "",
          endDate: "",
          current: false
        });
        setShowExperienceForm(false);
        alert('Опыт работы добавлен!');
      } catch (error) {
        alert('Ошибка при добавлении опыта: ' + error.message);
      }
    }
  };

  const handleUpdateResponse = async (responseId, updates) => {
    try {
      await updateResponse(responseId, updates);
      const responses = await getMyResponses();
      setMyResponses(responses || []);
      setEditingResponse(null);
      alert('Отклик успешно обновлен!');
    } catch (error) {
      alert('Ошибка при обновлении отклика: ' + error.message);
    }
  };

  const handleMyProjectsClick = () => {
    navigate("/my-projects");
  };

  // Вспомогательные функции
  const getStatusConfig = (status) => {
    const configs = {
      pending: { text: '⏳ На рассмотрении', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' },
      viewed: { text: '👀 Просмотрено', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' },
      accepted: { text: '✅ Принято', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' },
      rejected: { text: '❌ Отклонено', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' }
    };
    return configs[status] || configs.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Показываем загрузку
  if (loading) {
    return (
      <div className="profile-page">
        <LoadingSpinner message="Загрузка профиля..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <EmptyState 
          icon="🔒"
          title="Требуется авторизация"
          description="Войдите в систему для просмотра профиля"
          action={
            <button className="btn btn-primary" onClick={() => navigate("/login")}>
              Войти в систему
            </button>
          }
        />
      </div>
    );
  }

  // Если пользователь - заказчик
  if (user.role === "client") {
    return (
      <div className="profile-page">
        <div className="client-profile">
          <div className="profile-header">
            <div className="profile-avatar-section">
              <div
                className="profile-avatar"
                onClick={triggerAvatarUpload}
                style={{ cursor: "pointer" }}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt={user.profile.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {user.profile.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "П"}
                  </div>
                )}
                <div className="avatar-overlay">
                  <span>📷</span>
                  <p>Сменить фото</p>
                </div>
                {/* 🔥 ИСПРАВЛЕННЫЙ INPUT */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange} // Используем handleAvatarChange
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </div>
              <div className="verification-badge">
                <span className="badge">✅ Проверен</span>
              </div>
            </div>
            <div className="profile-main-info">
              <div className="name-section">
                <h1 className="profile-name">
                  {user.profile.name || "Пользователь"}
                </h1>
                <span className="role-badge client">💼 Заказчик</span>
              </div>

              {user.profile.location && (
                <p className="location">📍 {user.profile.location}</p>
              )}
              {user.profile.bio && (
                <p className="profile-description">{user.profile.bio}</p>
              )}
            </div>

            <div className="profile-actions">
              <button
                className="edit-profile-btn"
                onClick={() => setIsEditing(true)}
              >
                Настроить профиль
              </button>
            </div>
          </div>

          {isEditing && (
            <div className="edit-modal">
              <div className="modal-content">
                <h3>Редактирование профиля</h3>
                <div className="form-group">
                  <label>Имя *</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    placeholder="Ваше имя"
                  />
                </div>
                <div className="form-group">
                  <label>Местоположение *</label>
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleProfileChange}
                    placeholder="Город, страна"
                  />
                  {citySuggestions.length > 0 && (
                    <div className="suggestions-dropdown">
                      {citySuggestions.map(city => (
                        <div 
                          key={city} 
                          className="suggestion-item"
                          onClick={() => handleCitySelect(city)}
                        >
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>О себе *</label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    placeholder="Расскажите о себе..."
                    rows="4"
                  />
                </div>
                <div className="modal-actions">
                  <button 
                    className="save-btn" 
                    onClick={saveProfile}
                    disabled={saveLoading}
                  >
                    {saveLoading ? "Сохранение..." : "Сохранить"}
                  </button>
                  <button className="cancel-btn" onClick={cancelEdit}>
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="client-content">
            <div className="stats-section">
              <h2>📊 Статистика</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📋</div>
                  <div className="stat-number">{stats?.totalProjects || 0}</div>
                  <div className="stat-label">Создано проектов</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🔄</div>
                  <div className="stat-number">
                    {stats?.activeProjects || 0}
                  </div>
                  <div className="stat-label">Активных</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-number">
                    {stats?.completedProjects || 0}
                  </div>
                  <div className="stat-label">Завершено</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💬</div>
                  <div className="stat-number">
                    {stats?.totalResponses || 0}
                  </div>
                  <div className="stat-label">Откликов</div>
                </div>
              </div>
            </div>

            <div className="actions-section">
              <h2>🚀 Быстрые действия</h2>
              <div className="action-buttons">
                <button
                  className="action-btn primary"
                  onClick={() => navigate("/create-project")}
                >
                  📝 Создать проект
                </button>
                <button
                  className="action-btn secondary"
                  onClick={handleMyProjectsClick}
                >
                  📋 Мои проекты
                </button>
                <button
                  className="action-btn secondary"
                  onClick={() => navigate("/freelancers")}
                >
                  👥 Найти исполнителя
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Профиль фрилансера
  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar-section">
          <div
            className="profile-avatar"
            onClick={triggerAvatarUpload}
            style={{ cursor: "pointer" }}
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt={user.profile.name} />
            ) : user.profile.avatar ? (
              <img src={user.profile.avatar} alt={user.profile.name} />
            ) : (
              <div className="avatar-placeholder">
                {user.profile.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "П"}
              </div>
            )}
            <div className="avatar-overlay">
              <span>📷</span>
              <p>Сменить фото</p>
            </div>
            {/* 🔥 ИСПРАВЛЕННЫЙ INPUT */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange} // Используем handleAvatarChange
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>
          <div className="verification-badge">
            <span className="badge">✅ Проверен</span>
          </div>
        </div>

        <div className="profile-main-info">
          {isEditing ? (
            <div className="editable-fields">
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                placeholder="Ваше имя"
                className="edit-input large"
              />
              <input
                type="text"
                name="title"
                value={profileData.title}
                onChange={handleProfileChange}
                placeholder="Специализация"
                className="edit-input"
              />
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleProfileChange}
                placeholder="Расскажите о себе..."
                className="edit-textarea"
                rows="3"
              />
              <div className="contact-info">
                <input
                  type="text"
                  name="website"
                  value={profileData.website}
                  onChange={handleProfileChange}
                  placeholder="Website"
                  className="edit-input small"
                />
                <input
                  type="text"
                  name="telegram"
                  value={profileData.telegram}
                  onChange={handleProfileChange}
                  placeholder="Telegram"
                  className="edit-input small"
                />
                <input
                  type="text"
                  name="github"
                  value={profileData.github}
                  onChange={handleProfileChange}
                  placeholder="GitHub"
                  className="edit-input small"
                />
              </div>
              <div className="edit-details">
                <input
                  type="number"
                  name="hourlyRate"
                  value={profileData.hourlyRate}
                  onChange={handleProfileChange}
                  placeholder="Ставка в час (₽)"
                  className="edit-input small"
                />
                <div className="location-input-wrapper">
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleProfileChange}
                    placeholder="Местоположение"
                    className="edit-input small"
                  />
                  {citySuggestions.length > 0 && (
                    <div className="suggestions-dropdown">
                      {citySuggestions.map(city => (
                        <div 
                          key={city} 
                          className="suggestion-item"
                          onClick={() => handleCitySelect(city)}
                        >
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  name="experience"
                  value={profileData.experience}
                  onChange={handleProfileChange}
                  placeholder="Опыт работы"
                  className="edit-input small"
                />
              </div>
            </div>
          ) : (
            <div className="profile-main">
              <div className="name-section">
                <h1 className="profile-name">
                  {user.profile.name || "Не указано"}
                </h1>
                <span className="role-badge freelancer">🚀 Фрилансер</span>
              </div>

              {user.profile.title && (
                <p className="profile-title">{user.profile.title}</p>
              )}

              {user.profile.bio && (
                <p className="profile-description">{user.profile.bio}</p>
              )}

              <div className="profile-details">
                {user.profile.hourlyRate && (
                  <span className="detail-item">
                    💼 {user.profile.hourlyRate} ₽/час
                  </span>
                )}
                {user.profile.location && (
                  <span className="detail-item">
                    📍 {user.profile.location}
                  </span>
                )}
                {user.profile.experience && (
                  <span className="detail-item">
                    ⏱️ {user.profile.experience}
                  </span>
                )}
              </div>

              {(user.profile.website ||
                user.profile.telegram ||
                user.profile.github) && (
                <div className="social-links">
                  {user.profile.website && (
                    <a
                      href={user.profile.website}
                      className="social-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🌐 Website
                    </a>
                  )}
                  {user.profile.telegram && (
                    <a
                      href={`https://t.me/${user.profile.telegram}`}
                      className="social-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ✈️ Telegram
                    </a>
                  )}
                  {user.profile.github && (
                    <a
                      href={`https://github.com/${user.profile.github}`}
                      className="social-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      💻 GitHub
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{stats?.rating || "5.0"}</span>
              <span className="stat-label">⭐ Рейтинг</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {stats?.completedProjects || 0}
              </span>
              <span className="stat-label">✅ Проектов</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {user.profile.skills?.length || 0}
              </span>
              <span className="stat-label">🎯 Навыков</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats?.activeResponses || 0}</span>
              <span className="stat-label">📥 Активных откликов</span>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          {isEditing ? (
            <div className="edit-actions">
              <button 
                className="save-btn" 
                onClick={saveProfile}
                disabled={saveLoading}
              >
                {saveLoading ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    Сохранение...
                  </>
                ) : (
                  '💾 Сохранить'
                )}
              </button>
              <button className="cancel-btn" onClick={cancelEdit}>
                ❌ Отмена
              </button>
            </div>
          ) : (
            <button
              className="edit-profile-btn"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Редактировать профиль
            </button>
          )}
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab ${activeTab === "skills" ? "active" : ""}`}
          onClick={() => setActiveTab("skills")}
        >
          🎯 Навыки
        </button>
        <button
          className={`tab ${activeTab === "portfolio" ? "active" : ""}`}
          onClick={() => setActiveTab("portfolio")}
        >
          💼 Портфолио
        </button>
        <button
          className={`tab ${activeTab === "experience" ? "active" : ""}`}
          onClick={() => setActiveTab("experience")}
        >
          📈 Опыт работы
        </button>
        <button
          className={`tab ${activeTab === "responses" ? "active" : ""}`}
          onClick={() => setActiveTab("responses")}
        >
          📥 Мои отклики
        </button>
      </div>

      <div className="profile-content">
        {activeTab === "skills" && (
          <section className="skills-section">
            <div className="section-header">
              <h2>🎯 Навыки и технологии</h2>
              {isEditing && (
                <div className="add-skill-wrapper">
                  <div className="add-skill">
                    <div className="skill-input-wrapper">
                      <input
                        type="text"
                        placeholder="Добавить навык..."
                        value={newSkill}
                        onChange={(e) => handleSkillInputChange(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="skill-input"
                      />
                      {skillSuggestions.length > 0 && (
                        <div className="suggestions-dropdown">
                          {skillSuggestions.map(skill => (
                            <div 
                              key={skill} 
                              className="suggestion-item"
                              onClick={() => handleSkillSelect(skill)}
                            >
                              {skill}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <select
                      value={skillLevel}
                      onChange={(e) => setSkillLevel(e.target.value)}
                      className="level-select"
                    >
                      {SKILL_LEVELS.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                    <button onClick={addNewSkill} className="add-skill-btn">
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="skills-list">
              {user.profile.skills?.length > 0 ? (
                user.profile.skills.map((skillItem, index) => (
                  <SkillTag
                    key={index}
                    skill={skillItem.skill}
                    level={skillItem.level}
                    onRemove={removeSkill}
                    editable={isEditing}
                  />
                ))
              ) : (
                <EmptyState
                  icon="🎯"
                  title="Навыки еще не добавлены"
                  description={isEditing ? "Добавьте свои первые навыки выше" : "Навыки пока не добавлены в профиль"}
                />
              )}
            </div>
          </section>
        )}

        {activeTab === "portfolio" && (
          <section className="portfolio-section">
            <div className="section-header">
              <h2>💼 Портфолио проектов</h2>
              {isEditing && (
                <button
                  className="add-portfolio-btn"
                  onClick={() => setShowPortfolioForm(true)}
                >
                  + Добавить проект
                </button>
              )}
            </div>

            {showPortfolioForm && (
              <div className="portfolio-form">
                <h3>Добавить проект в портфолио</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Название проекта *</label>
                    <input
                      type="text"
                      placeholder="Название проекта"
                      value={newPortfolioItem.title}
                      onChange={(e) =>
                        setNewPortfolioItem((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Категория</label>
                    <select
                      value={newPortfolioItem.category}
                      onChange={(e) =>
                        setNewPortfolioItem((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="form-select"
                    >
                      <option value="development">Разработка</option>
                      <option value="design">Дизайн</option>
                      <option value="marketing">Маркетинг</option>
                      <option value="writing">Копирайтинг</option>
                      <option value="seo">SEO</option>
                      <option value="other">Другое</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Описание проекта *</label>
                  <textarea
                    placeholder="Подробное описание проекта, используемых технологий, решаемых задач..."
                    value={newPortfolioItem.description}
                    onChange={(e) =>
                      setNewPortfolioItem((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="form-textarea"
                    rows="4"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Срок выполнения</label>
                    <input
                      type="text"
                      placeholder="Например: 2 недели, 1 месяц"
                      value={newPortfolioItem.duration}
                      onChange={(e) =>
                        setNewPortfolioItem((prev) => ({
                          ...prev,
                          duration: e.target.value,
                        }))
                      }
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Бюджет (₽)</label>
                    <input
                      type="number"
                      placeholder="Сумма проекта"
                      value={newPortfolioItem.budget}
                      onChange={(e) =>
                        setNewPortfolioItem((prev) => ({
                          ...prev,
                          budget: e.target.value,
                        }))
                      }
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Ссылка на проект (необязательно)</label>
                  <input
                    type="text"
                    placeholder="https://example.com"
                    value={newPortfolioItem.link}
                    onChange={(e) =>
                      setNewPortfolioItem((prev) => ({
                        ...prev,
                        link: e.target.value,
                      }))
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>URL главного изображения (необязательно)</label>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={newPortfolioItem.image}
                    onChange={(e) =>
                      setNewPortfolioItem((prev) => ({
                        ...prev,
                        image: e.target.value,
                      }))
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-actions">
                  <button onClick={handleAddPortfolio} className="save-btn">
                    Добавить в портфолио
                  </button>
                  <button
                    onClick={() => setShowPortfolioForm(false)}
                    className="cancel-btn"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}

            <div className="portfolio-list">
              {user.profile.portfolio?.length > 0 ? (
                user.profile.portfolio.map((item) => (
                  <PortfolioItem
                    key={item.id}
                    item={item}
                    onRemove={removePortfolioItem}
                    editable={isEditing}
                  />
                ))
              ) : (
                <EmptyState
                  icon="💼"
                  title="Портфолио пустое"
                  description={isEditing ? "Добавьте свои первые проекты в портфолио" : "В портфолио пока нет проектов"}
                />
              )}
            </div>
          </section>
        )}

        {activeTab === "experience" && (
          <section className="experience-section">
            <div className="section-header">
              <h2>📈 Опыт работы</h2>
              {isEditing && (
                <button
                  className="add-experience-btn"
                  onClick={() => setShowExperienceForm(true)}
                >
                  + Добавить опыт работы
                </button>
              )}
            </div>

            {showExperienceForm && (
              <div className="experience-form">
                <h3>Добавить опыт работы</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Должность *</label>
                    <input
                      type="text"
                      placeholder="Например: Frontend Developer"
                      value={newExperience.position}
                      onChange={(e) =>
                        setNewExperience((prev) => ({
                          ...prev,
                          position: e.target.value,
                        }))
                      }
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Компания *</label>
                    <input
                      type="text"
                      placeholder="Название компании"
                      value={newExperience.company}
                      onChange={(e) =>
                        setNewExperience((prev) => ({
                          ...prev,
                          company: e.target.value,
                        }))
                      }
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Начало работы</label>
                    <input
                      type="month"
                      value={newExperience.startDate}
                      onChange={(e) =>
                        setNewExperience((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Окончание</label>
                    <input
                      type="month"
                      value={newExperience.endDate}
                      onChange={(e) =>
                        setNewExperience((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      disabled={newExperience.current}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={newExperience.current}
                        onChange={(e) =>
                          setNewExperience((prev) => ({
                            ...prev,
                            current: e.target.checked,
                          }))
                        }
                      />
                      Работаю сейчас
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Описание обязанностей</label>
                  <textarea
                    placeholder="Опишите ваши обязанности и достижения..."
                    value={newExperience.description}
                    onChange={(e) =>
                      setNewExperience((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="form-textarea"
                    rows="4"
                  />
                </div>
                <div className="form-actions">
                  <button onClick={handleAddExperience} className="save-btn">
                    Добавить опыт
                  </button>
                  <button
                    onClick={() => setShowExperienceForm(false)}
                    className="cancel-btn"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}

            <div className="experience-list">
              {user.profile.experience?.length > 0 ? (
                user.profile.experience.map((exp) => (
                  <div key={exp.id} className="experience-item">
                    <div className="experience-header">
                      <h4>{exp.position}</h4>
                      {isEditing && (
                        <button
                          onClick={() => removeExperience(exp.id)}
                          className="remove-btn"
                        >
                          ❌
                        </button>
                      )}
                    </div>
                    <p className="company">{exp.company}</p>
                    <p className="period">
                      {exp.startDate} - {exp.current ? "Настоящее время" : exp.endDate}
                    </p>
                    {exp.description && (
                      <p className="description">{exp.description}</p>
                    )}
                  </div>
                ))
              ) : (
                <EmptyState
                  icon="📈"
                  title="Опыт работы не указан"
                  description={isEditing ? "Добавьте информацию о своем опыте работы" : "Информация об опыте работы пока не добавлена"}
                />
              )}
            </div>
          </section>
        )}

        {activeTab === "responses" && (
          <section className="responses-section">
            <div className="section-header">
              <h2>📥 Мои отклики</h2>
              <div className="response-filters">
                <select className="filter-select">
                  <option value="all">Все отклики</option>
                  <option value="pending">На рассмотрении</option>
                  <option value="viewed">Просмотрены</option>
                  <option value="accepted">Приняты</option>
                  <option value="rejected">Отклонены</option>
                </select>
              </div>
            </div>

            <div className="responses-list">
              {myResponses.length > 0 ? (
                myResponses.map((response) => (
                  <div key={response.id} className="response-item">
                    <div className="response-header">
                      <div className="project-info">
                        <h4 className="project-title">
                          {response.projectTitle || "Проект"}
                        </h4>
                        <span className="response-date">
                          📅 {formatDate(response.createdAt)}
                        </span>
                      </div>
                      <div className="response-status">
                        <span 
                          className="status-badge"
                          style={{
                            color: getStatusConfig(response.status).color,
                            backgroundColor: getStatusConfig(response.status).bgColor,
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          {getStatusConfig(response.status).text}
                        </span>
                      </div>
                    </div>

                    <div className="response-details">
                      <div className="proposal-section">
                        <p className="proposal-text">
                          {response.proposal || "Отклик отправлен"}
                        </p>
                        {response.budget && (
                          <p className="proposed-budget">
                            💰 Предложенная сумма: <strong>{response.budget} ₽</strong>
                          </p>
                        )}
                        {response.deadline && (
                          <p className="proposed-deadline">
                            ⏱️ Предложенный срок: <strong>{response.deadline}</strong>
                        </p>
                        )}
                      </div>

                      {editingResponse === response.id ? (
                        <div className="edit-response-form">
                          <textarea
                            value={response.proposal}
                            onChange={(e) => handleUpdateResponse(response.id, {
                              proposal: e.target.value
                            })}
                            className="edit-proposal-textarea"
                            rows="3"
                            placeholder="Введите ваш отклик..."
                          />
                          <div className="edit-response-actions">
                            <button 
                              className="save-btn small"
                              onClick={() => handleUpdateResponse(response.id, {
                                proposal: response.proposal
                              })}
                            >
                              Сохранить
                            </button>
                            <button 
                              className="cancel-btn small"
                              onClick={() => setEditingResponse(null)}
                            >
                              Отмена
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="response-actions">
                          <button 
                            className="edit-response-btn"
                            onClick={() => setEditingResponse(response.id)}
                          >
                            ✏️ Редактировать
                          </button>
                          {response.status === 'viewed' && (
                            <span className="viewed-indicator">
                              👀 Заказчик просмотрел ваш отклик
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon="📥"
                  title="Откликов пока нет"
                  description="Начните откликаться на проекты, и они появятся здесь"
                  action={
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate("/projects")}
                    >
                      Найти проекты
                    </button>
                  }
                />
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;