// services/initialData.js
export const initializeDemoData = () => {
  // Проверяем, есть ли уже демо-данные
  const hasDemoData = localStorage.getItem('demo_data_initialized')
  if (hasDemoData) return

  // Демо пользователи
  const demoUsers = [
    {
      id: '1',
      email: 'freelancer@demo.ru',
      password: 'demo123',
      role: 'freelancer',
      createdAt: new Date().toISOString(),
      profile: {
        name: 'Алексей Петров',
        bio: 'Full-stack разработчик с 5-летним опытом. Специализируюсь на React, Node.js и MongoDB.',
        category: 'development',
        rating: 4.8,
        completedProjects: 47,
        responseRate: '95%',
        online: true,
        skills: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'MongoDB', 'Express']
      }
    },
    {
      id: '2', 
      email: 'client@demo.ru',
      password: 'demo123',
      role: 'client',
      createdAt: new Date().toISOString(),
      profile: {
        name: 'Мария Сидорова',
        bio: 'Основатель стартапа в сфере EdTech. Ищу талантливых разработчиков для создания образовательной платформы.',
        category: 'other',
        rating: 4.9,
        completedProjects: 12,
        responseRate: '100%',
        online: false
      }
    }
  ]

  // Демо проекты
  const demoProjects = [
    {
      id: '1',
      title: 'Разработка лендинга для кофейни',
      description: 'Нужно создать современный лендинг для новой кофейни в центре города. Требуется адаптивный дизайн, интеграция с системой бронирования и онлайн-заказа.',
      category: 'development',
      budget: 25000,
      deadline: '2 недели',
      skills: ['HTML/CSS', 'JavaScript', 'React', 'Адаптивный дизайн'],
      client: {
        id: '2',
        name: 'Мария Сидорова'
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'open',
      responses: [],
      views: 15
    },
    {
      id: '2',
      title: 'Дизайн мобильного приложения для фитнеса',
      description: 'Требуется разработать UI/UX дизайн для фитнес-приложения. Включает создание макетов основных экранов, иконок и анимаций.',
      category: 'design', 
      budget: 40000,
      deadline: '3 недели',
      skills: ['UI/UX Design', 'Figma', 'Mobile Design', 'Animation'],
      client: {
        id: '2',
        name: 'Мария Сидорова'
      },
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'open',
      responses: [],
      views: 23
    }
  ]

  // Сохраняем демо-данные
  localStorage.setItem('nexus_users', JSON.stringify(demoUsers))
  localStorage.setItem('nexus_projects', JSON.stringify(demoProjects))
  localStorage.setItem('demo_data_initialized', 'true')
  
  console.log('Demo data initialized')
}