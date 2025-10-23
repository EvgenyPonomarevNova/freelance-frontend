// pages/SettingsPage/SettingsPage.jsx
import './SettingsPage.scss'
import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'

function SettingsPage() {
  const { user, updateUser } = useUser()
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    category: '',
    skills: [],
    hourlyRate: '',
    location: '',
    website: ''
  })

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    projectNotifications: true,
    messageNotifications: true,
    marketingEmails: false,
    smsNotifications: false
  })

  const [paymentSettings, setPaymentSettings] = useState({
    paymentMethod: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.profile?.name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        bio: user.profile?.bio || '',
        category: user.profile?.category || '',
        skills: user.profile?.skills || [],
        hourlyRate: user.profile?.hourlyRate || '',
        location: user.profile?.location || '',
        website: user.profile?.website || ''
      })
    }
  }, [user])

  const tabs = [
    { id: 'profile', name: 'Профиль', icon: '👤' },
    { id: 'security', name: 'Безопасность', icon: '🔐' },
    { id: 'notifications', name: 'Уведомления', icon: '🔔' },
    { id: 'payments', name: 'Платежи', icon: '💳' },
    { id: 'privacy', name: 'Конфиденциальность', icon: '🛡️' }
  ]

  const categories = [
    { value: 'development', label: '💻 Разработка' },
    { value: 'design', label: '🎨 Дизайн' },
    { value: 'marketing', label: '📊 Маркетинг' },
    { value: 'writing', label: '📝 Тексты' },
    { value: 'seo', label: '🔍 SEO' },
    { value: 'other', label: '🔧 Другое' }
  ]

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      // Обновляем данные пользователя
      const updatedUser = {
        ...user,
        email: profileData.email,
        profile: {
          ...user.profile,
          ...profileData
        }
      }
      
      // Обновляем в localStorage
      const users = JSON.parse(localStorage.getItem('nexus_users') || '[]')
      const userIndex = users.findIndex(u => u.id === user.id)
      if (userIndex !== -1) {
        users[userIndex] = updatedUser
        localStorage.setItem('nexus_users', JSON.stringify(users))
      }
      
      // Обновляем в контексте
      updateUser(updatedUser)
      
      alert('Профиль успешно обновлен!')
    } catch (error) {
      alert('Ошибка при сохранении профиля')
    } finally {
      setSaving(false)
    }
  }

  const handleSecuritySave = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      if (securityData.newPassword !== securityData.confirmPassword) {
        alert('Новые пароли не совпадают')
        return
      }
      
      // В реальном приложении здесь был бы API запрос
      alert('Пароль успешно изменен!')
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      alert('Ошибка при изменении пароля')
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      // Сохраняем настройки уведомлений
      const userSettings = JSON.parse(localStorage.getItem('user_settings') || '{}')
      userSettings[user.id] = { notifications: notificationSettings }
      localStorage.setItem('user_settings', JSON.stringify(userSettings))
      
      alert('Настройки уведомлений сохранены!')
    } catch (error) {
      alert('Ошибка при сохранении настроек')
    } finally {
      setSaving(false)
    }
  }

  const renderProfileTab = () => (
    <div className="settings-tab">
      <div className="tab-header">
        <h2>Настройки профиля</h2>
        <p>Управляйте вашей персональной информацией</p>
      </div>

      <form onSubmit={handleProfileSave}>
        <div className="form-section">
          <h3>Основная информация</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Полное имя *</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                placeholder="Введите ваше имя"
                required
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Телефон</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                placeholder="+7 (999) 999-99-99"
              />
            </div>
            <div className="form-group">
              <label>Местоположение</label>
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                placeholder="Город, страна"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Профессиональная информация</h3>
          <div className="form-group">
            <label>Категория</label>
            <select
              value={profileData.category}
              onChange={(e) => setProfileData({...profileData, category: e.target.value})}
            >
              <option value="">Выберите категорию</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>О себе</label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
              placeholder="Расскажите о вашем опыте и специализации..."
              rows="4"
            />
          </div>

          {user?.role === 'freelancer' && (
            <div className="form-group">
              <label>Почасовая ставка (₽)</label>
              <input
                type="number"
                value={profileData.hourlyRate}
                onChange={(e) => setProfileData({...profileData, hourlyRate: e.target.value})}
                placeholder="1000"
              />
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>Ссылки</h3>
          <div className="form-group">
            <label>Веб-сайт</label>
            <input
              type="url"
              value={profileData.website}
              onChange={(e) => setProfileData({...profileData, website: e.target.value})}
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      </form>
    </div>
  )

  const renderSecurityTab = () => (
    <div className="settings-tab">
      <div className="tab-header">
        <h2>Безопасность аккаунта</h2>
        <p>Управляйте паролем и настройками безопасности</p>
      </div>

      <form onSubmit={handleSecuritySave}>
        <div className="form-section">
          <h3>Смена пароля</h3>
          <div className="form-group">
            <label>Текущий пароль *</label>
            <input
              type="password"
              value={securityData.currentPassword}
              onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
              placeholder="Введите текущий пароль"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Новый пароль *</label>
              <input
                type="password"
                value={securityData.newPassword}
                onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                placeholder="Не менее 6 символов"
                required
              />
            </div>
            <div className="form-group">
              <label>Подтвердите пароль *</label>
              <input
                type="password"
                value={securityData.confirmPassword}
                onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                placeholder="Повторите новый пароль"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Двухфакторная аутентификация</h3>
          <div className="security-feature">
            <div className="feature-info">
              <h4>Добавить дополнительную защиту</h4>
              <p>Включите двухфакторную аутентификацию для повышенной безопасности</p>
            </div>
            <button type="button" className="btn btn-outline">
              Включить
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Сохранение...' : 'Обновить пароль'}
          </button>
        </div>
      </form>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="settings-tab">
      <div className="tab-header">
        <h2>Настройки уведомлений</h2>
        <p>Управляйте тем, как вы получаете уведомления</p>
      </div>

      <form onSubmit={handleNotificationSave}>
        <div className="form-section">
          <h3>Email уведомления</h3>
          
          <div className="notification-item">
            <div className="notification-info">
              <h4>Уведомления о проектах</h4>
              <p>Получать уведомления о новых проектах и откликах</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notificationSettings.projectNotifications}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  projectNotifications: e.target.checked
                })}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="notification-info">
              <h4>Сообщения</h4>
              <p>Уведомления о новых сообщениях в чате</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notificationSettings.messageNotifications}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  messageNotifications: e.target.checked
                })}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="notification-info">
              <h4>Маркетинговые рассылки</h4>
              <p>Получать новости и специальные предложения</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notificationSettings.marketingEmails}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  marketingEmails: e.target.checked
                })}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>SMS уведомления</h3>
          <div className="notification-item">
            <div className="notification-info">
              <h4>SMS оповещения</h4>
              <p>Получать важные уведомления по SMS</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notificationSettings.smsNotifications}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  smsNotifications: e.target.checked
                })}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Сохранение...' : 'Сохранить настройки'}
          </button>
        </div>
      </form>
    </div>
  )

  const renderPaymentsTab = () => (
    <div className="settings-tab">
      <div className="tab-header">
        <h2>Платежные методы</h2>
        <p>Управляйте способами получения и отправки платежей</p>
      </div>

      <div className="form-section">
        <h3>Добавить платежный метод</h3>
        
        <div className="payment-methods">
          <div className="payment-method-card">
            <div className="method-icon">💳</div>
            <div className="method-info">
              <h4>Банковская карта</h4>
              <p>Visa, Mastercard, Мир</p>
            </div>
            <button className="btn btn-outline">Добавить</button>
          </div>

          <div className="payment-method-card">
            <div className="method-icon">🏦</div>
            <div className="method-info">
              <h4>Банковский перевод</h4>
              <p>Прямой перевод на счет</p>
            </div>
            <button className="btn btn-outline">Добавить</button>
          </div>

          <div className="payment-method-card">
            <div className="method-icon">📱</div>
            <div className="method-info">
              <h4>Электронные кошельки</h4>
              <p>ЮMoney, Qiwi, WebMoney</p>
            </div>
            <button className="btn btn-outline">Добавить</button>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>История платежей</h3>
        <div className="empty-state">
          <div className="empty-icon">💸</div>
          <p>Пока нет истории платежей</p>
        </div>
      </div>
    </div>
  )

  const renderPrivacyTab = () => (
    <div className="settings-tab">
      <div className="tab-header">
        <h2>Конфиденциальность</h2>
        <p>Управляйте вашими настройками конфиденциальности</p>
      </div>

      <div className="form-section">
        <h3>Видимость профиля</h3>
        
        <div className="privacy-item">
          <div className="privacy-info">
            <h4>Публичный профиль</h4>
            <p>Разрешить другим пользователям просматривать ваш профиль</p>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>

        <div className="privacy-item">
          <div className="privacy-info">
            <h4>Показывать онлайн-статус</h4>
            <p>Отображать когда вы онлайн</p>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div className="form-section">
        <h3>Управление данными</h3>
        
        <div className="privacy-action">
          <div className="action-info">
            <h4>Экспорт данных</h4>
            <p>Скачайте копию ваших данных с платформы</p>
          </div>
          <button className="btn btn-outline">Экспортировать</button>
        </div>

        <div className="privacy-action">
          <div className="action-info">
            <h4>Удаление аккаунта</h4>
            <p>Полностью удалите ваш аккаунт и все данные</p>
          </div>
          <button className="btn btn-danger">Удалить аккаунт</button>
        </div>
      </div>
    </div>
  )

  if (!user) {
    return (
      <div className="settings-page">
        <div className="not-authorized">
          <h2>Требуется авторизация</h2>
          <p>Войдите в систему для доступа к настройкам</p>
        </div>
      </div>
    )
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Настройки аккаунта</h1>
        <p>Управляйте вашими персональными настройками и предпочтениями</p>
      </div>

      <div className="settings-layout">
        <div className="settings-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-name">{tab.name}</span>
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'security' && renderSecurityTab()}
          {activeTab === 'notifications' && renderNotificationsTab()}
          {activeTab === 'payments' && renderPaymentsTab()}
          {activeTab === 'privacy' && renderPrivacyTab()}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage