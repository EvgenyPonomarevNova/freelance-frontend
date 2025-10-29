// src/components/RegisterForm/RegisterForm.jsx
import "./RegisterForm.scss";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import OAuthButtons from "../OAuthButtons/OAuthButtons"; // Добавьте этот импорт

function RegisterForm({ onSuccess }) {
  const { register } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    role: "freelancer",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    
    if (errors.submit) {
      setErrors((prev) => ({ ...prev, submit: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Некорректный формат email";
    }

    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен быть не менее 6 символов";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = "Пароль должен содержать заглавные и строчные буквы";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Имя обязательно";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Имя должно содержать минимум 2 символа";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "Необходимо согласие с условиями";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const registrationData = {
        email: formData.email.trim(),
        password: formData.password,
        fullName: formData.fullName.trim(),
        role: formData.role
      };

      await register(registrationData);
      onSuccess?.();
      navigate("/profile-setup", { 
        state: { 
          welcome: true,
          role: formData.role 
        } 
      });
      
    } catch (error) {
      let errorMessage = 'Произошла ошибка при регистрации';
      
      if (error.message.includes('уже существует')) {
        errorMessage = 'Пользователь с таким email уже существует';
      } else if (error.message.includes('сеть') || error.message.includes('network')) {
        errorMessage = 'Проблемы с соединением. Проверьте интернет';
      } else if (error.message.includes('валидации') || error.message.includes('validation')) {
        errorMessage = 'Проверьте правильность введенных данных';
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDescription = (role) => {
    const descriptions = {
      freelancer: {
        title: "Находите интересные проекты",
        features: [
          "Создайте портфолио",
          "Получайте заказы", 
          "Работайте удаленно",
          "Выстраивайте репутацию"
        ]
      },
      client: {
        title: "Найдите исполнителей для ваших задач", 
        features: [
          "Публикуйте проекты",
          "Выбирайте из откликов",
          "Контролируйте сроки",
          "Безопасные платежи"
        ]
      }
    };
    return descriptions[role] || descriptions.freelancer;
  };

  const roleInfo = getRoleDescription(formData.role);

  return (
    <div className="register-form">
      <div className="form-header">
        <h2>
          Присоединиться к <span className="accent">FreelanceHub</span>
        </h2>
        <p>Создайте аккаунт и начните работать</p>
      </div>

      {errors.submit && (
        <div className="error-message">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Выбор роли */}
        <div className="role-selection">
          <h3>Кто вы?</h3>
          <div className="role-options">
            <label
              className={`role-option ${
                formData.role === "freelancer" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="role"
                value="freelancer"
                checked={formData.role === "freelancer"}
                onChange={handleChange}
                disabled={isLoading}
              />
              <div className="role-content">
                <div className="role-icon">💼</div>
                <div className="role-info">
                  <h4>Фрилансер</h4>
                  <p>Ищу проекты для работы</p>
                </div>
              </div>
            </label>

            <label
              className={`role-option ${
                formData.role === "client" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="role"
                value="client"
                checked={formData.role === "client"}
                onChange={handleChange}
                disabled={isLoading}
              />
              <div className="role-content">
                <div className="role-icon">👔</div>
                <div className="role-info">
                  <h4>Заказчик</h4>
                  <p>Ищу исполнителей</p>
                </div>
              </div>
            </label>
          </div>

          {/* Описание выбранной роли */}
          <div className="role-description">
            <h4>{roleInfo.title}</h4>
            <ul>
              {roleInfo.features.map((feature, index) => (
                <li key={index}>✓ {feature}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Основные поля */}
        <div className="form-fields">
          <div className="form-group">
            <label htmlFor="fullName">Полное имя *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Иван Иванов"
              className={errors.fullName ? "error" : ""}
              disabled={isLoading}
              autoComplete="name"
            />
            {errors.fullName && (
              <span className="error-text">{errors.fullName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={errors.email ? "error" : ""}
              disabled={isLoading}
              autoComplete="email"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Не менее 6 символов"
              className={errors.password ? "error" : ""}
              disabled={isLoading}
              autoComplete="new-password"
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
            <div className="password-hint">
              Пароль должен содержать заглавные и строчные буквы
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Подтвердите пароль *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Повторите пароль"
              className={errors.confirmPassword ? "error" : ""}
              disabled={isLoading}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>
        </div>

        {/* Соглашение */}
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              disabled={isLoading}
            />
            <span className="checkmark"></span>
            Я соглашаюсь с{" "}
            <a href="/rules" target="_blank" rel="noopener noreferrer">
              правилами платформы
            </a>{" "}
            и{" "}
            <a href="/privacy" target="_blank" rel="noopener noreferrer">
              политикой конфиденциальности
            </a>
          </label>
          {errors.agreeToTerms && (
            <span className="error-text">{errors.agreeToTerms}</span>
          )}
        </div>

        <button 
          type="submit" 
          className={`submit-btn ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Регистрация...
            </>
          ) : (
            'Создать аккаунт'
          )}
        </button>

        {/* OAuth кнопки для регистрации */}
        <OAuthButtons type="register" isLoading={isLoading} />

        <div className="form-footer">
          <p>
            Уже есть аккаунт?{" "}
            <a href="/login" className="link">
              Войти
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;