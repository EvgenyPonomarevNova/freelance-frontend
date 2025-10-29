// pages/MyProjectsPage/MyProjectsPage.jsx
import { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import ProjectViewModal from '../../components/ProjectViewModal/ProjectViewModal';
import ProjectEditModal from '../../components/ProjectEditModal/ProjectEditModal';
import './MyProjectsPage.scss';

function MyProjectsPage() {
  const { user, getMyProjects } = useUser();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedProject, setExpandedProject] = useState(null);
  
  // 🔥 ДОБАВЬТЕ ЭТИ СОСТОЯНИЯ ДЛЯ МОДАЛОК
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const loadMyProjects = async () => {
      if (user) {
        try {
          setLoading(true);
          const myProjects = await getMyProjects();
          setProjects(Array.isArray(myProjects) ? myProjects : []);
        } catch (error) {
          console.error('Error loading projects:', error);
          setProjects([]);
        } finally {
          setLoading(false);
        }
      }
    };

    loadMyProjects();
  }, [user, getMyProjects]);

  // 🔥 ДОБАВЬТЕ ФУНКЦИИ ДЛЯ РАБОТЫ С МОДАЛКАМИ
  const handleViewProject = (project) => {
    setSelectedProject(project);
    setViewModalOpen(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setViewModalOpen(false);
    setEditModalOpen(true);
  };

  const handleCloseModals = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setSelectedProject(null);
  };

  const handleSaveProject = async (projectId, updatedData) => {
    try {
      // Здесь вызов API для сохранения проекта
      console.log('Saving project:', projectId, updatedData);
      
      // Обновляем локальное состояние
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, ...updatedData, updated_at: new Date().toISOString() }
          : project
      ));
      
      // Показываем уведомление об успехе
      alert('Проект успешно обновлен!');
    } catch (error) {
      console.error('Error saving project:', error);
      throw error;
    }
  };

  // Остальной код компонента (статистика, фильтрация и т.д.)...
  const projectStats = {
    all: projects.length,
    open: projects.filter(p => p.status === 'open').length,
    in_progress: projects.filter(p => p.status === 'in_progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    cancelled: projects.filter(p => p.status === 'cancelled').length
  };

  const filteredProjects = projects.filter(project => {
    if (activeTab === 'all') return true;
    return project.status === activeTab;
  });

  const getStatusConfig = (status) => {
    const configs = {
      open: { text: '🔓 Открыт', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' },
      in_progress: { text: '⚡ В работе', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' },
      completed: { text: '✅ Завершен', color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.1)' },
      cancelled: { text: '❌ Отменен', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' }
    };
    return configs[status] || configs.open;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const toggleProjectExpand = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  // 🔥 ОБНОВИТЕ КНОПКИ В КАРТОЧКАХ ПРОЕКТОВ
  // Вместо navigate используйте handleViewProject и handleEditProject

  if (!user) {
    return (
      <div className="my-projects-page">
        <div className="not-authorized">
          <div className="auth-icon">🔒</div>
          <h2>Требуется авторизация</h2>
          <p>Войдите в систему для просмотра ваших проектов</p>
          <button 
            className="auth-btn"
            onClick={() => navigate('/login')}
          >
            Войти в систему
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-projects-page">
      {/* Заголовок и статистика */}
      <div className="page-header">
        <div className="header-content">
          <h1>🚀 Мои проекты</h1>
          <p>Управляйте вашими проектами и отслеживайте отклики</p>
        </div>
        <button 
          className="create-project-btn"
          onClick={() => navigate('/create-project')}
        >
          <span className="btn-icon">+</span>
          Создать проект
        </button>
      </div>

      {/* Статистика */}
      <div className="projects-stats">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-value">{projectStats.all}</div>
          <div className="stat-label">Всего проектов</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔓</div>
          <div className="stat-value">{projectStats.open}</div>
          <div className="stat-label">Открытых</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-value">{projectStats.in_progress}</div>
          <div className="stat-label">В работе</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{projectStats.completed}</div>
          <div className="stat-label">Завершено</div>
        </div>
      </div>

      {/* Табы фильтрации */}
      <div className="projects-tabs">
        <button 
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <span>Все проекты</span>
          <span className="tab-count">{projectStats.all}</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'open' ? 'active' : ''}`}
          onClick={() => setActiveTab('open')}
        >
          <span>Открытые</span>
          <span className="tab-count">{projectStats.open}</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'in_progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('in_progress')}
        >
          <span>В работе</span>
          <span className="tab-count">{projectStats.in_progress}</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          <span>Завершенные</span>
          <span className="tab-count">{projectStats.completed}</span>
        </button>
      </div>

      {/* Список проектов */}
      <div className="projects-list">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Загружаем ваши проекты...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              {activeTab === 'all' ? '📋' : 
               activeTab === 'open' ? '🔓' :
               activeTab === 'in_progress' ? '⚡' : '✅'}
            </div>
            <h3>
              {activeTab === 'all' ? 'Проекты не найдены' :
               activeTab === 'open' ? 'Нет открытых проектов' :
               activeTab === 'in_progress' ? 'Нет проектов в работе' :
               'Нет завершенных проектов'}
            </h3>
            <p>
              {activeTab === 'all' 
                ? 'Создайте первый проект и начните сотрудничество с фрилансерами'
                : `У вас пока нет проектов со статусом "${getStatusConfig(activeTab).text}"`
              }
            </p>
            {activeTab === 'all' && (
              <button 
                className="create-project-btn"
                onClick={() => navigate('/create-project')}
              >
                + Создать первый проект
              </button>
            )}
          </div>
        ) : (
          filteredProjects.map(project => {
            const statusConfig = getStatusConfig(project.status);
            const isExpanded = expandedProject === project.id;
            
            return (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <div className="project-info">
                    <h3 className="project-title">
                      <a 
                        href={`/projects/${project.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleViewProject(project); // 🔥 ИЗМЕНИЛИ НА handleViewProject
                        }}
                      >
                        {project.title}
                      </a>
                    </h3>
                    <div className="project-meta">
                      <span className="project-budget">💰 {project.budget} ₽</span>
                      <span className="project-category">🏷️ {project.category}</span>
                      <span className="project-date">📅 {formatDate(project.created_at)}</span>
                    </div>
                  </div>
                  <div className="project-actions">
                    <div 
                      className="status-badge"
                      style={{ 
                        color: statusConfig.color,
                        backgroundColor: statusConfig.bgColor
                      }}
                    >
                      {statusConfig.text}
                    </div>
                    <div className="response-count">
                      💬 {project.responses?.length || 0}
                    </div>
                  </div>
                </div>

                <p className="project-description">{project.description}</p>

                {/* Статистика проекта */}
                <div className="project-stats">
                  <div className="stat">
                    <strong>{project.responses?.length || 0}</strong>
                    <span>Откликов</span>
                  </div>
                  <div className="stat">
                    <strong>
                      {project.responses?.reduce((sum, r) => sum + (r.proposedBudget || 0), 0) || 0} ₽
                    </strong>
                    <span>Предложено всего</span>
                  </div>
                  <div className="stat">
                    <strong>
                      {project.responses?.length ? 
                        Math.round(project.responses.reduce((sum, r) => sum + (r.proposedBudget || 0), 0) / project.responses.length) : 0
                      } ₽
                    </strong>
                    <span>Среднее предложение</span>
                  </div>
                </div>

                {/* Кнопки действий */}
                <div className="project-footer">
                  <div className="action-buttons">
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleViewProject(project)} // 🔥 ИЗМЕНИЛИ
                    >
                      👁️ Просмотреть
                    </button>
                    <button 
                      className="btn btn-outline"
                      onClick={() => handleEditProject(project)} // 🔥 ИЗМЕНИЛИ
                    >
                      ✏️ Редактировать
                    </button>
                    <button 
                      className="btn btn-outline"
                      onClick={() => toggleProjectExpand(project.id)}
                    >
                      {isExpanded ? '📥 Скрыть' : '📤 Показать'} отклики
                    </button>
                  </div>
                </div>

                {/* Расширенная информация с откликами */}
                {isExpanded && project.responses && project.responses.length > 0 && (
                  <div className="project-responses">
                    <h4>💬 Отклики на проект:</h4>
                    <div className="responses-list">
                      {project.responses.map((response, index) => (
                        <div key={index} className="response-item">
                          <div className="response-header">
                            <span className="freelancer-name">
                              👤 {response.freelancerName || 'Анонимный фрилансер'}
                            </span>
                            <span className="response-budget">
                              💰 {response.proposedBudget || 'Не указано'} ₽
                            </span>
                          </div>
                          <p className="response-message">
                            {response.message || 'Без сопроводительного сообщения'}
                          </p>
                          <div className="response-actions">
                            <span className="response-date">
                              📅 {formatDate(response.created_at || new Date())}
                            </span>
                            <div className="response-buttons">
                              <button className="btn btn-success btn-sm">
                                ✅ Принять
                              </button>
                              <button className="btn btn-danger btn-sm">
                                ❌ Отклонить
                              </button>
                              <button className="btn btn-outline btn-sm">
                                💬 Написать
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isExpanded && (!project.responses || project.responses.length === 0) && (
                  <div className="project-responses">
                    <div className="no-responses">
                      <div className="no-responses-icon">💬</div>
                      <p>Пока нет откликов на этот проект</p>
                      <small>Разместите проект в более подходящей категории для привлечения фрилансеров</small>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <ProjectViewModal
        project={selectedProject}
        isOpen={viewModalOpen}
        onClose={handleCloseModals}
        onEdit={() => handleEditProject(selectedProject)}
      />

      <ProjectEditModal
        project={selectedProject}
        isOpen={editModalOpen}
        onClose={handleCloseModals}
        onSave={handleSaveProject}
      />
      
    </div> 
  );
}

export default MyProjectsPage;