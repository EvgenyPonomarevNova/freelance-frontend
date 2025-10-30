// src/constants/userSchema.js
export const USER_PROFILE_SCHEMA = {
  name: '',
  bio: '',
  title: '',
  location: '',
  hourlyRate: '',
  experience: '',
  website: '',
  telegram: '',
  github: '',
  skills: [],
  portfolio: [],
  experienceList: [],
  avatar: null
};

export const PROJECT_CATEGORIES = [
  { value: 'development', label: '💻 Разработка', icon: '💻' },
  { value: 'design', label: '🎨 Дизайн', icon: '🎨' },
  { value: 'marketing', label: '📊 Маркетинг', icon: '📊' },
  { value: 'writing', label: '📝 Тексты', icon: '📝' },
  { value: 'seo', label: '🔍 SEO', icon: '🔍' },
  { value: 'other', label: '🔧 Другое', icon: '🔧' }
];

export const SKILL_LEVELS = [
  { value: 'beginner', label: 'Начальный' },
  { value: 'intermediate', label: 'Средний' },
  { value: 'advanced', label: 'Продвинутый' },
  { value: 'expert', label: 'Эксперт' }
];