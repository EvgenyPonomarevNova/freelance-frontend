import "./ProfilePage.scss";
import { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import SkillTag from "../../components/SkillTag/SkillTag";
import PortfolioItem from "../../components/PortfolioItem/PortfolioItem";

function ProfilePage() {
  const {
    user,
    updateProfile,
    addSkill,
    removeSkill,
    addPortfolioItem,
    removePortfolioItem,
  } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    title: "",
    description: "",
    hourlyRate: "",
    location: "",
    experience: "",
  });

  const [newSkill, setNewSkill] = useState("");
  const [skillLevel, setSkillLevel] = useState("intermediate");
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    title: "",
    description: "",
    skills: [],
    link: "",
  });
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);

  // Инициализация данных профиля при загрузке
  useEffect(() => {
    if (user?.profile) {
      setProfileData({
        name: user.profile.name || "",
        title: user.profile.title || "",
        description: user.profile.description || "",
        hourlyRate: user.profile.hourlyRate || "",
        location: user.profile.location || "",
        experience: user.profile.experience || "",
      });
    }
  }, [user]);

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

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveProfile = () => {
    updateProfile(profileData);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setProfileData({
      name: user.profile.name || "",
      title: user.profile.title || "",
      description: user.profile.description || "",
      hourlyRate: user.profile.hourlyRate || "",
      location: user.profile.location || "",
      experience: user.profile.experience || "",
    });
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
      });
      setShowPortfolioForm(false);
    }
  };

  // Если пользователь - заказчик, показываем упрощенный профиль
  if (user.role === "client") {
    return (
      <div className="profile-page">
        <div className="client-profile">
          <div className="profile-header">
            <div className="profile-avatar">
              <div className="avatar-placeholder">
                {user.profile.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "П"}
              </div>
            </div>

            <div className="profile-info">
              <h1>{user.profile.name || "Пользователь"}</h1>
              <p className="role-badge">Заказчик</p>
              {user.profile.location && (
                <p className="location">📍 {user.profile.location}</p>
              )}
              {user.profile.description && (
                <p className="description">{user.profile.description}</p>
              )}
            </div>

            <div className="profile-actions">
              <button
                className="edit-profile-btn"
                onClick={() => navigate("/profile-setup")}
              >
                Настроить профиль
              </button>
            </div>
          </div>

          <div className="client-content">
            <div className="client-stats">
              <h2>Статистика заказчика</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">0</div>
                  <div className="stat-label">Создано проектов</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">0</div>
                  <div className="stat-label">Активных</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">0</div>
                  <div className="stat-label">Завершено</div>
                </div>
              </div>
            </div>

            <div className="client-actions">
              <h2>Действия</h2>
              <button
                className="primary-btn"
                onClick={() => navigate("/projects")}
              >
                Создать новый проект
              </button>
              <button className="secondary-btn">Посмотреть мои проекты</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Профиль фрилансера
  return (
    <div className="profile-page">
      {/* Хедер профиля */}
      <div className="profile-header">
        <div className="profile-avatar">
          {user.profile.avatar ? (
            <img src={user.profile.avatar} alt={user.profile.name} />
          ) : (
            <div className="avatar-placeholder">
              {user.profile.name
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "П"}
            </div>
          )}
        </div>

        <div className="profile-info">
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
                placeholder="Специализация (например: Frontend Developer)"
                className="edit-input"
              />
              <textarea
                name="description"
                value={profileData.description}
                onChange={handleProfileChange}
                placeholder="Расскажите о себе, вашем опыте и специализации..."
                className="edit-textarea"
                rows="3"
              />
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
              <h1 className="profile-name">
                {user.profile.name || "Не указано"}
              </h1>
              {user.profile.title && (
                <p className="profile-title">{user.profile.title}</p>
              )}
              {user.profile.description && (
                <p className="profile-description">
                  {user.profile.description}
                </p>
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
            </div>
          )}

          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{user.profile.rating || "0.0"}</span>
              <span className="stat-label">Рейтинг</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {user.profile.completedProjects || 0}
              </span>
              <span className="stat-label">Проектов</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {user.profile.skills?.length || 0}
              </span>
              <span className="stat-label">Навыков</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {user.profile.portfolio?.length || 0}
              </span>
              <span className="stat-label">В портфолио</span>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="save-btn" onClick={saveProfile}>
                💾 Сохранить
              </button>
              <button className="cancel-btn" onClick={cancelEdit}>
                ❌ Отмена
              </button>
            </>
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

      <div className="profile-content">
        {/* Блок навыков */}
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
              <p className="empty-state">Навыки еще не добавлены</p>
            )}
          </div>
        </section>

        {/* Блок портфолио */}
        <section className="portfolio-section">
          <div className="section-header">
            <h2>💼 Портфолио</h2>
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
              <p className="empty-state">
                Проекты в портфолио еще не добавлены
              </p>
            )}
          </div>
        </section>

        {/* Блок опыта работы */}
        <section className="experience-section">
          <h2>📈 Опыт работы</h2>
          <div className="experience-list">
            {user.profile.experienceList?.length > 0 ? ( // ← experienceList вместо experience
              user.profile.experienceList.map((exp, index) => (
                <div key={index} className="experience-item">
                  <h3>{exp.position}</h3>
                  <p className="company">{exp.company}</p>
                  <p className="period">{exp.period}</p>
                  <p className="description">{exp.description}</p>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>Информация об опыте работы пока не добавлена</p>
                {isEditing && (
                  <button className="add-experience-btn">
                    + Добавить место работы
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;
