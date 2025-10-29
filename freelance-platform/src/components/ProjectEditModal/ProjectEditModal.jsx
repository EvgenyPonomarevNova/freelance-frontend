// components/ProjectEditModal/ProjectEditModal.jsx
import { useState, useEffect } from 'react';
import './ProjectEditModal.scss';

function ProjectEditModal({ project, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Инициализация формы при открытии
  useEffect(() => {
    if (project && isOpen) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        budget: project.budget || '',
        category: project.category || '',
        skills: project.skills?.join(', ') || '',
        deadline: project.deadline || '',
        difficulty: project.difficulty || '',
        work_type: project.work_type || '',
        status: project.status || 'open'
      });
      setErrors({});
    }
  }, [project, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Название проекта обязательно';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Описание проекта обязательно';
    }
    
    if (!formData.budget || formData.budget <= 0) {
      newErrors.budget = 'Бюджет должен быть положительным числом';
    }
    
    if (!formData.category?.trim()) {
      newErrors.category = 'Категория обязательна';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Преобразуем навыки из строки в массив
      const submitData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
      };
      
      await onSave(project.id, submitData);
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
      setErrors({ submit: 'Ошибка при сохранении проекта' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !project) return null;

  const categories = [
    'web_development', 'mobile_development', 'design', 'marketing',
    'writing', 'translation', 'admin_support', 'customer_service',
    'data_science', 'engineering', 'other'
  ];

  const categoryLabels = {
    web_development: '🌐 Веб-разработка',
    mobile_development: '📱 Мобильная разработка',
    design: '🎨 Дизайн',
    marketing: '📈 Маркетинг',
    writing: '✍️ Копирайтинг',
    translation: '🔤 Перевод',
    admin_support: '📊 Администрирование',
    customer_service: '💁 Поддержка',
    data_science: '📊 Data Science',
    engineering: '⚙️ Инженерия',
    other: '🔧 Другое'
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="project-edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✏️ Редактирование проекта</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-content">
            {/* Основная информация */}
            <div className="form-section">
              <h3>📋 Основная информация</h3>
              
              <div className="form-group">
                <label htmlFor="title">Название проекта *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  className={errors.title ? 'error' : ''}
                  placeholder="Введите название проекта"
                />
                {errors.title && <span className="error-text">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="description">Описание проекта *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows="5"
                  className={errors.description ? 'error' : ''}
                  placeholder="Подробно опишите ваш проект, требования и ожидания"
                />
                {errors.description && <span className="error-text">{errors.description}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="budget">Бюджет (₽) *</label>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={formData.budget || ''}
                    onChange={handleChange}
                    className={errors.budget ? 'error' : ''}
                    placeholder="5000"
                    min="0"
                  />
                  {errors.budget && <span className="error-text">{errors.budget}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="category">Категория *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category || ''}
                    onChange={handleChange}
                    className={errors.category ? 'error' : ''}
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {categoryLabels[cat] || cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && <span className="error-text">{errors.category}</span>}
                </div>
              </div>
            </div>

            {/* Детали проекта */}
            <div className="form-section">
              <h3>⚙️ Детали проекта</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="deadline">Срок выполнения</label>
                  <input
                    type="text"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline || ''}
                    onChange={handleChange}
                    placeholder="например, 2 недели"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="difficulty">Уровень сложности</label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty || ''}
                    onChange={handleChange}
                  >
                    <option value="">Не указано</option>
                    <option value="beginner">👶 Начальный</option>
                    <option value="intermediate">💪 Средний</option>
                    <option value="expert">🔥 Сложный</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="work_type">Тип работы</label>
                <select
                  id="work_type"
                  name="work_type"
                  value={formData.work_type || ''}
                  onChange={handleChange}
                >
                  <option value="">Не указано</option>
                  <option value="one_time">⏱️ Разовая работа</option>
                  <option value="ongoing">🔄 Постоянная работа</option>
                  <option value="hourly">⏰ Почасовая оплата</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="skills">Навыки (через запятую)</label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills || ''}
                  onChange={handleChange}
                  placeholder="JavaScript, React, Node.js, Design"
                />
                <small>Перечислите навыки через запятую</small>
              </div>
            </div>

            {/* Статус проекта */}
            <div className="form-section">
              <h3>📊 Статус проекта</h3>
              <div className="form-group">
                <label htmlFor="status">Статус</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status || 'open'}
                  onChange={handleChange}
                >
                  <option value="open">🔓 Открыт</option>
                  <option value="in_progress">⚡ В работе</option>
                  <option value="completed">✅ Завершен</option>
                  <option value="cancelled">❌ Отменен</option>
                </select>
              </div>
            </div>
          </div>

          {/* Ошибка сохранения */}
          {errors.submit && (
            <div className="form-error">
              {errors.submit}
            </div>
          )}

          {/* Футер формы */}
          <div className="form-footer">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Отмена
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? '💾 Сохранение...' : '💾 Сохранить изменения'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectEditModal;