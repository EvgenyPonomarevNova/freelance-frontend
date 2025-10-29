// pages/ProfilePage/ProfilePage.jsx
import "./ProfilePage.scss";
import { useState, useEffect, useRef } from "react";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import SkillTag from "../../components/SkillTag/SkillTag";
import PortfolioItem from "../../components/PortfolioItem/PortfolioItem";

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
  } = useUser();

  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("skills");
  const [stats, setStats] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [profileData, setProfileData] = useState({
    name: "",
    title: "",
    description: "",
    hourlyRate: "",
    location: "",
    experience: "",
    website: "",
    telegram: "",
    github: "",
  });

  const [newSkill, setNewSkill] = useState("");
  const [skillLevel, setSkillLevel] = useState("intermediate");
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    title: "",
    description: "",
    skills: [],
    link: "",
    image: "",
  });

  const [newExperience, setNewExperience] = useState({
    position: "",
    company: "",
    period: "",
    description: "",
  });

  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);

  // Загрузка статистики
  useEffect(() => {
    const loadStats = async () => {
      if (user) {
        try {
          const userStats = await getUserStats();
          setStats(userStats);
        } catch (error) {
          console.error("Error loading stats:", error);
        }
      }
    };

    loadStats();
  }, [user, getUserStats]);

  // Инициализация данных профиля
  useEffect(() => {
    if (user?.profile) {
      setProfileData({
        name: user.profile.name || "",
        title: user.profile.title || "",
        description: user.profile.bio || "", // ← ИЗМЕНИЛИ НА bio
        hourlyRate: user.profile.hourlyRate || "",
        location: user.profile.location || "",
        experience: user.profile.experience || "",
        website: user.profile.website || "",
        telegram: user.profile.telegram || "",
        github: user.profile.github || "",
      });
    }
  }, [user]);

useEffect(() => {
  if (user) {
    console.log('👤 Current user data:', user);
    console.log('👤 User profile data:', user.profile);

    const userData = {
      name: user.profile?.name || user.name || "",
      title: user.profile?.title || user.title || "",
      description: user.profile?.bio || user.bio || "",
      hourlyRate: user.profile?.hourlyRate || user.hourlyRate || "",
      location: user.profile?.location || user.location || "",
      experience: user.profile?.experience || user.experience || "",
      website: user.profile?.website || user.website || "",
      telegram: user.profile?.telegram || user.telegram || "",
      github: user.profile?.github || user.github || "",
    };

    console.log('📝 Initializing profile data:', userData);
    setProfileData(userData);

    // 🔥 ВАЖНО: Всегда инициализируем avatarPreview из данных пользователя
    if (user.profile?.avatar) {
      console.log('🖼️ Setting avatar from user profile:', user.profile.avatar);
      setAvatarPreview(user.profile.avatar);
    } else {
      setAvatarPreview(null);
    }
  }
}, [user]);
  // Функции
const handleAvatarUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    // Валидация файла
    if (!file.type.startsWith("image/")) {
      alert("Пожалуйста, выберите изображение");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Размер файла не должен превышать 5MB");
      return;
    }

    // Чтение файла и конвертация в base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imageUrl = e.target.result;
        
        // Сразу показываем превью
        setAvatarPreview(imageUrl);
        
        // Сохраняем на сервер
        console.log('📤 Uploading avatar to server...');
        const result = await updateProfile({ avatar: imageUrl });
        
        if (result?.success) {
          console.log('✅ Avatar saved successfully');
          // Превью уже установлено, данные в localStorage обновятся автоматически через updateProfile
        } else {
          console.error('❌ Failed to save avatar');
          alert('Ошибка при сохранении фото');
          // Откатываем превью в случае ошибки
          setAvatarPreview(user.profile?.avatar || null);
        }
      } catch (error) {
        console.error('❌ Avatar upload error:', error);
        alert('Ошибка при загрузке фото');
        setAvatarPreview(user.profile?.avatar || null);
      }
    };
    
    reader.onerror = () => {
      alert('Ошибка при чтении файла');
    };
    
    reader.readAsDataURL(file);
    
  } catch (error) {
    console.error('❌ File processing error:', error);
    alert('Ошибка при обработке файла');
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
  };

const saveProfile = async () => {
  try {
    const dataToSave = {
      name: profileData.name,
      bio: profileData.description,
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

    // Всегда закрываем редактирование и показываем успех
    setIsEditing(false);
    
    // Проверяем localStorage сразу после сохранения
    const savedUser = localStorage.getItem('current_user');
    console.log('💾 Current localStorage:', JSON.parse(savedUser));
    
    alert('Профиль успешно обновлен!');
    
    // Обновляем статистику
    const updatedStats = await getUserStats();
    setStats(updatedStats);

  } catch (error) {
    console.error('❌ Save error:', error);
    alert('Ошибка при сохранении профиля: ' + error.message);
  }
};

const cancelEdit = () => {
  if (user) {
    // Используем данные из текущего пользователя
    setProfileData({
      name: user.name || user.profile?.name || "",
      title: user.title || user.profile?.title || "",
      description: user.bio || user.profile?.bio || "", // bio → description
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
    if (
      newSkill.trim() &&
      !user.profile.skills?.find((s) => s.skill === newSkill.trim())
    ) {
      addSkill(newSkill.trim(), skillLevel);
      setNewSkill("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addNewSkill();
    }
  };

  const handleAddPortfolio = () => {
    if (newPortfolioItem.title.trim() && newPortfolioItem.description.trim()) {
      addPortfolioItem({
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
      });
      setShowPortfolioForm(false);
    }
  };

  const handleAddExperience = () => {
    if (newExperience.position.trim() && newExperience.company.trim()) {
      addExperience({
        ...newExperience,
        id: Date.now(),
      });
      setNewExperience({
        position: "",
        company: "",
        period: "",
        description: "",
      });
      setShowExperienceForm(false);
    }
  };

  const handleMyProjectsClick = () => {
    navigate("/my-projects");
  };

  // Показываем загрузку
  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="not-logged-in">
          <h2>Пожалуйста, войдите в систему</h2>
          <p>Чтобы просмотреть профиль, необходимо авторизоваться</p>
          <button className="auth-btn" onClick={() => navigate("/login")}>
            Войти
          </button>
        </div>
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
    style={{ cursor: "pointer" }} // Всегда кликабельно
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
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleAvatarUpload}
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
                </div>
                <div className="form-group">
                  <label>О себе *</label>
                  <textarea
                    name="description"
                    value={profileData.description}
                    onChange={handleProfileChange}
                    placeholder="Расскажите о себе..."
                    rows="4"
                  />
                </div>
                <div className="modal-actions">
                  <button className="save-btn" onClick={saveProfile}>
                    Сохранить
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
    style={{ cursor: "pointer" }} // Всегда кликабельно
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
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleAvatarUpload}
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
                name="description"
                value={profileData.description}
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
                <input
                  type="text"
                  name="location"
                  value={profileData.location}
                  onChange={handleProfileChange}
                  placeholder="Местоположение"
                  className="edit-input small"
                />
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
              <button className="save-btn" onClick={saveProfile}>
                💾 Сохранить
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
                <div className="add-skill">
                  <input
                    type="text"
                    placeholder="Добавить навык..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="skill-input"
                  />
                  <select
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value)}
                    className="level-select"
                  >
                    <option value="beginner">Начальный</option>
                    <option value="intermediate">Средний</option>
                    <option value="advanced">Продвинутый</option>
                    <option value="expert">Эксперт</option>
                  </select>
                  <button onClick={addNewSkill} className="add-skill-btn">
                    +
                  </button>
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
                <div className="empty-state">
                  <div className="empty-icon">🎯</div>
                  <p>Навыки еще не добавлены</p>
                  {isEditing && (
                    <p className="empty-hint">
                      Добавьте свои первые навыки выше
                    </p>
                  )}
                </div>
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
                <div className="form-group">
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
                  <textarea
                    placeholder="Описание проекта"
                    value={newPortfolioItem.description}
                    onChange={(e) =>
                      setNewPortfolioItem((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="form-textarea"
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Ссылка на проект (необязательно)"
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
                  <input
                    type="text"
                    placeholder="URL изображения (необязательно)"
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
                    Добавить
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
                    editable={isEditing}
                    onEdit={(item) => console.log("Edit:", item)}
                    onDelete={removePortfolioItem}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">💼</div>
                  <p>Проекты в портфолио еще не добавлены</p>
                  {isEditing && (
                    <p className="empty-hint">
                      Начните с добавления первого проекта
                    </p>
                  )}
                </div>
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
                  + Добавить опыт
                </button>
              )}
            </div>

            {showExperienceForm && (
              <div className="experience-form">
                <h3>Добавить опыт работы</h3>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Должность"
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
                  <input
                    type="text"
                    placeholder="Компания"
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
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Период работы"
                    value={newExperience.period}
                    onChange={(e) =>
                      setNewExperience((prev) => ({
                        ...prev,
                        period: e.target.value,
                      }))
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="Описание обязанностей"
                    value={newExperience.description}
                    onChange={(e) =>
                      setNewExperience((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="form-textarea"
                    rows="3"
                  />
                </div>
                <div className="form-actions">
                  <button onClick={handleAddExperience} className="save-btn">
                    Добавить
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
              {user.profile.experienceList?.length > 0 ? (
                user.profile.experienceList.map((exp) => (
                  <div key={exp.id} className="experience-item">
                    <div className="experience-header">
                      <h3>{exp.position}</h3>
                      {isEditing && (
                        <button
                          className="delete-btn"
                          onClick={() => removeExperience(exp.id)}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                    <p className="company">🏢 {exp.company}</p>
                    <p className="period">📅 {exp.period}</p>
                    <p className="description">{exp.description}</p>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📈</div>
                  <p>Информация об опыте работы пока не добавлена</p>
                  {isEditing && (
                    <p className="empty-hint">
                      Добавьте свой первый опыт работы
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === "responses" && (
          <section className="responses-section">
            <h2>📥 Мои отклики</h2>
            <div className="responses-stats">
              <div className="stat-card">
                <div className="stat-number">{stats?.totalResponses || 0}</div>
                <div className="stat-label">Всего откликов</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats?.activeResponses || 0}</div>
                <div className="stat-label">На рассмотрении</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {stats?.acceptedResponses || 0}
                </div>
                <div className="stat-label">Принято</div>
              </div>
            </div>
            <div className="responses-list">
              <div className="empty-state">
                <div className="empty-icon">📥</div>
                <p>У вас пока нет откликов на проекты</p>
                <button
                  className="action-btn primary"
                  onClick={() => navigate("/projects")}
                >
                  Найти проекты
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
