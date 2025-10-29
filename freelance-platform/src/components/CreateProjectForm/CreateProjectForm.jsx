// components/CreateProjectForm/CreateProjectForm.jsx
import { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import './CreateProjectForm.scss';

function CreateProjectForm({ onSuccess, onCancel }) {
  const { user, createProject } = useUser();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    category: 'development',
    budget: '',
    deadline: '',
    skills: []
  });

  const [newSkill, setNewSkill] = useState('');

  const categories = [
    { value: 'development', label: '💻 Разработка' },
    { value: 'design', label: '🎨 Дизайн' },
    { value: 'marketing', label: '📈 Маркетинг' },
    { value: 'writing', label: '✍️ Копирайтинг' },
    { value: 'seo', label: '🔍 SEO' },
    { value: 'other', label: '🔧 Другое' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: value
    }));
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !projectData.skills.includes(newSkill.trim())) {
      setProjectData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProjectData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!projectData.title.trim()) {
      newErrors.title = 'Название проекта обязательно';
    } else if (projectData.title.length < 5) {
      newErrors.title = 'Название должно быть не менее 5 символов';
    }

    if (!projectData.description.trim()) {
      newErrors.description = 'Описание проекта обязательно';
    } else if (projectData.description.length < 10) {
      newErrors.description = 'Описание должно быть не менее 10 символов';
    }

    if (!projectData.budget || projectData.budget < 1000) {
      newErrors.budget = 'Бюджет должен быть не менее 1000 рублей';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Для создания проекта необходимо авторизоваться');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await createProject({
        ...projectData,
        budget: parseInt(projectData.budget),
        deadline: projectData.deadline || undefined
      });

      if (result.success) {
        alert('Проект успешно создан!');
        onSuccess?.();
      } else {
        alert('Ошибка при создании проекта: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Ошибка при создании проекта: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="create-project-form">
        <div className="not-authorized">
          <h2>Необходима авторизация</h2>
          <p>Для создания проекта войдите в систему</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-project-form">
      <div className="form-header">
        <h1>📝 Создать новый проект</h1>
        <p>Заполните информацию о вашем проекте</p>
      </div>

      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-group">
          <label htmlFor="title">Название проекта *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={projectData.title}
            onChange={handleChange}
            placeholder="Например: Разработка веб-приложения"
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Описание проекта *</label>
          <textarea
            id="description"
            name="description"
            value={projectData.description}
            onChange={handleChange}
            placeholder="Опишите детали проекта, требования и ожидания..."
            rows="6"
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Категория *</label>
            <select
              id="category"
              name="category"
              value={projectData.category}
              onChange={handleChange}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="budget">Бюджет (₽) *</label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={projectData.budget}
              onChange={handleChange}
              placeholder="5000"
              min="1000"
              className={errors.budget ? 'error' : ''}
            />
            {errors.budget && <span className="error-text">{errors.budget}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="deadline">Срок выполнения (необязательно)</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={projectData.deadline}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="form-group">
          <label>Требуемые навыки</label>
          <div className="skills-input">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Добавить навык..."
              className="skill-input"
            />
            <button type="button" onClick={addSkill} className="add-skill-btn">
              +
            </button>
          </div>
          
          {projectData.skills.length > 0 && (
            <div className="skills-list">
              {projectData.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                  <button 
                    type="button" 
                    onClick={() => removeSkill(skill)}
                    className="remove-skill"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel}
            className="cancel-btn"
            disabled={loading}
          >
            Отмена
          </button>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Создание...' : 'Создать проект'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateProjectForm;