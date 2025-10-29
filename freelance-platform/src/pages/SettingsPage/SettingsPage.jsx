// pages/SettingsPage/SettingsPage.jsx
import './SettingsPage.scss'
import { useState, useEffect, useRef } from 'react'
import { useUser } from '../../contexts/UserContext'
import { countries, popularCountries, findCountryByName, findCitiesByCountry } from '../../utils/countriesData'

function SettingsPage() {
  const { user, updateUser } = useUser()
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [emailVerification, setEmailVerification] = useState({
    code: '',
    isVerifying: false,
    isVerified: true, // предполагаем, что изначально email подтвержден
    showVerificationField: false
  })
  
  const countryInputRef = useRef(null)
  const cityInputRef = useRef(null)

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    category: '',
    skills: [],
    hourlyRate: '',
    country: '',
    city: '',
    website: '',
    timezone: ''
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
    smsNotifications: false,
    desktopNotifications: true,
    weeklyDigest: true
  })

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'dark',
    language: 'ru',
    fontSize: 'medium',
    compactMode: false
  })

  const [countrySuggestions, setCountrySuggestions] = useState([])
  const [citySuggestions, setCitySuggestions] = useState([])
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false)
  const [showCitySuggestions, setShowCitySuggestions] = useState(false)

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
        country: user.profile?.country || '',
        city: user.profile?.city || '',
        website: user.profile?.website || '',
        timezone: user.profile?.timezone || 'Europe/Moscow'
      })
      
      // Проверяем статус верификации email
      setEmailVerification(prev => ({
        ...prev,
        isVerified: user.emailVerified || true
      }))
    }
  }, [user])

  const tabs = [
    { id: 'profile', name: 'Профиль', icon: '👤' },
    { id: 'security', name: 'Безопасность', icon: '🔐' },
    { id: 'notifications', name: 'Уведомления', icon: '🔔' },
    { id: 'appearance', name: 'Внешний вид', icon: '🎨' },
    { id: 'privacy', name: 'Конфиденциальность', icon: '🛡️' }
  ]

  // Убираем вкладку платежей для всех пользователей

  const categories = [
    { value: '', label: 'Выберите категорию' },
    { value: 'development', label: '💻 Разработка' },
    { value: 'design', label: '🎨 Дизайн' },
    { value: 'marketing', label: '📊 Маркетинг' },
    { value: 'writing', label: '📝 Тексты' },
    { value: 'seo', label: '🔍 SEO' },
    { value: 'consulting', label: '📋 Консалтинг' },
    { value: 'translation', label: '🌐 Переводы' },
    { value: 'other', label: '🔧 Другое' }
  ]

  const timezones = [
    { value: 'Europe/Moscow', label: 'Москва (UTC+3)' },
    { value: 'Europe/Kaliningrad', label: 'Калининград (UTC+2)' },
    { value: 'Asia/Yekaterinburg', label: 'Екатеринбург (UTC+5)' },
    { value: 'Asia/Novosibirsk', label: 'Новосибирск (UTC+7)' },
    { value: 'Asia/Vladivostok', label: 'Владивосток (UTC+10)' },
    { value: 'Europe/London', label: 'Лондон (UTC+0)' },
    { value: 'Europe/Berlin', label: 'Берлин (UTC+1)' },
    { value: 'America/New_York', label: 'Нью-Йорк (UTC-5)' },
    { value: 'America/Los_Angeles', label: 'Лос-Анджелес (UTC-8)' }
  ]

  const handleCountryInput = (value) => {
    setProfileData({...profileData, country: value})
    
    if (value.length > 1) {
      const suggestions = countries
        .filter(country => 
          country.name.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 8)
      setCountrySuggestions(suggestions)
      setShowCountrySuggestions(true)
    } else {
      setShowCountrySuggestions(false)
    }
  }

  const handleCountrySelect = (country) => {
    setProfileData({
      ...profileData, 
      country: country.name,
      city: ''
    })
    setShowCountrySuggestions(false)
    setCitySuggestions(country.cities)
  }

  const handleCityInput = (value) => {
    setProfileData({...profileData, city: value})
    
    if (value.length > 1 && profileData.country) {
      const country = findCountryByName(profileData.country)
      if (country) {
        const suggestions = country.cities
          .filter(city => 
            city.toLowerCase().includes(value.toLowerCase())
          )
          .slice(0, 8)
        setCitySuggestions(suggestions)
        setShowCitySuggestions(true)
      }
    } else {
      setShowCitySuggestions(false)
    }
  }

  const handleCitySelect = (city) => {
    setProfileData({...profileData, city})
    setShowCitySuggestions(false)
  }

  // Функция для отправки кода подтверждения на email
  const sendVerificationCode = async () => {
    if (!profileData.email) {
      alert('❌ Пожалуйста, введите email адрес')
      return
    }

    setEmailVerification(prev => ({ ...prev, isVerifying: true }))
    
    try {
      // Имитация отправки кода на email
      setTimeout(() => {
        setEmailVerification(prev => ({
          ...prev,
          isVerifying: false,
          showVerificationField: true
        }))
        alert(`📧 Код подтверждения отправлен на ${profileData.email}`)
      }, 2000)
    } catch (error) {
      alert('❌ Ошибка при отправке кода подтверждения')
      setEmailVerification(prev => ({ ...prev, isVerifying: false }))
    }
  }

  // Функция для проверки кода подтверждения
  const verifyEmailCode = async () => {
    if (!emailVerification.code) {
      alert('❌ Пожалуйста, введите код подтверждения')
      return
    }

    setEmailVerification(prev => ({ ...prev, isVerifying: true }))
    
    try {
      // Имитация проверки кода
      setTimeout(() => {
        if (emailVerification.code === '123456') { // Заглушка для демонстрации
          setEmailVerification(prev => ({
            ...prev,
            isVerifying: false,
            isVerified: true,
            showVerificationField: false
          }))
          alert('✅ Email успешно подтвержден!')
        } else {
          alert('❌ Неверный код подтверждения')
          setEmailVerification(prev => ({ ...prev, isVerifying: false }))
        }
      }, 1500)
    } catch (error) {
      alert('❌ Ошибка при проверке кода')
      setEmailVerification(prev => ({ ...prev, isVerifying: false }))
    }
  }

  const handleProfileSave = async (e) => {
    e.preventDefault()
    
    // Проверяем, изменился ли email и не подтвержден ли он
    if (profileData.email !== user.email && !emailVerification.isVerified) {
      alert('❌ Пожалуйста, подтвердите новый email адрес перед сохранением')
      return
    }
    
    setSaving(true)
    
    try {
      const updatedUser = {
        ...user,
        email: profileData.email,
        emailVerified: emailVerification.isVerified,
        profile: {
          ...user.profile,
          ...profileData
        }
      }
      
      const users = JSON.parse(localStorage.getItem('nexus_users') || '[]')
      const userIndex = users.findIndex(u => u.id === user.id)
      if (userIndex !== -1) {
        users[userIndex] = updatedUser
        localStorage.setItem('nexus_users', JSON.stringify(users))
      }
      
      updateUser(updatedUser)
      alert('✅ Профиль успешно обновлен!')
    } catch (error) {
      alert('❌ Ошибка при сохранении профиля')
    } finally {
      setSaving(false)
    }
  }

  const handleSecuritySave = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      if (securityData.newPassword !== securityData.confirmPassword) {
        alert('❌ Новые пароли не совпадают')
        return
      }
      
      if (securityData.newPassword.length < 6) {
        alert('❌ Пароль должен быть не менее 6 символов')
        return
      }
      
      alert('✅ Пароль успешно изменен!')
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      alert('❌ Ошибка при изменении пароля')
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const userSettings = JSON.parse(localStorage.getItem('user_settings') || '{}')
      userSettings[user.id] = { 
        notifications: notificationSettings,
        appearance: appearanceSettings
      }
      localStorage.setItem('user_settings', JSON.stringify(userSettings))
      
      alert('✅ Настройки сохранены!')
    } catch (error) {
      alert('❌ Ошибка при сохранении настроек')
    } finally {
      setSaving(false)
    }
  }

  const renderProfileTab = () => (
    <div className="settings-tab">
      <div className="tab-header">
        <h2>Настройки профиля</h2>
        <p>Управляйте вашей персональной информацией и предпочтениями</p>
      </div>

      <form onSubmit={handleProfileSave}>
        <div className="form-section">
          <h3>👤 Основная информация</h3>
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
              <div className="email-verification">
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => {
                    setProfileData({...profileData, email: e.target.value})
                    // Сбрасываем статус верификации при изменении email
                    if (e.target.value !== user.email) {
                      setEmailVerification({
                        code: '',
                        isVerifying: false,
                        isVerified: false,
                        showVerificationField: false
                      })
                    }
                  }}
                  placeholder="your@email.com"
                  required
                />
                {profileData.email && (
                  <div className="verification-status">
                    {emailVerification.isVerified ? (
                      <span className="verified-badge">✅ Подтвержден</span>
                    ) : (
                      <span className="unverified-badge">❌ Не подтвержден</span>
                    )}
                  </div>
                )}
              </div>
              
              {/* Поле для ввода кода подтверждения */}
              {emailVerification.showVerificationField && (
                <div className="verification-code-input">
                  <label>Код подтверждения *</label>
                  <div className="code-input-group">
                    <input
                      type="text"
                      value={emailVerification.code}
                      onChange={(e) => setEmailVerification(prev => ({ 
                        ...prev, 
                        code: e.target.value 
                      }))}
                      placeholder="Введите код из письма"
                      maxLength="6"
                    />
                    <button 
                      type="button" 
                      className="btn btn-outline verify-btn"
                      onClick={verifyEmailCode}
                      disabled={emailVerification.isVerifying}
                    >
                      {emailVerification.isVerifying ? (
                        <>
                          <div className="loading-spinner-small"></div>
                          Проверка...
                        </>
                      ) : (
                        '✅ Подтвердить'
                      )}
                    </button>
                  </div>
                </div>
              )}
              
              {/* Кнопка отправки кода */}
              {profileData.email && profileData.email !== user.email && !emailVerification.isVerified && !emailVerification.showVerificationField && (
                <button 
                  type="button" 
                  className="btn btn-outline send-code-btn"
                  onClick={sendVerificationCode}
                  disabled={emailVerification.isVerifying}
                >
                  {emailVerification.isVerifying ? (
                    <>
                      <div className="loading-spinner-small"></div>
                      Отправка...
                    </>
                  ) : (
                    '📧 Отправить код подтверждения'
                  )}
                </button>
              )}
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
              <label>Часовой пояс</label>
              <select
                value={profileData.timezone}
                onChange={(e) => setProfileData({...profileData, timezone: e.target.value})}
              >
                {timezones.map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>🌍 Местоположение</h3>
          <div className="form-row">
            <div className="form-group autocomplete">
              <label>Страна</label>
              <input
                ref={countryInputRef}
                type="text"
                value={profileData.country}
                onChange={(e) => handleCountryInput(e.target.value)}
                placeholder="Начните вводить название страны..."
                onFocus={() => profileData.country && handleCountryInput(profileData.country)}
              />
              {showCountrySuggestions && (
                <div className="suggestions-dropdown">
                  {popularCountries.map(country => (
                    <div 
                      key={country}
                      className="suggestion-item popular"
                      onClick={() => handleCountrySelect({name: country, cities: []})}
                    >
                      🌟 {country}
                    </div>
                  ))}
                  {countrySuggestions.map(country => (
                    <div 
                      key={country.code}
                      className="suggestion-item"
                      onClick={() => handleCountrySelect(country)}
                    >
                      {country.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group autocomplete">
              <label>Город</label>
              <input
                ref={cityInputRef}
                type="text"
                value={profileData.city}
                onChange={(e) => handleCityInput(e.target.value)}
                placeholder="Начните вводить название города..."
                disabled={!profileData.country}
                onFocus={() => profileData.city && handleCityInput(profileData.city)}
              />
              {showCitySuggestions && (
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
          </div>
        </div>

        {/* Профессиональная информация только для фрилансеров */}
        {user?.role === 'freelancer' && (
          <div className="form-section">
            <h3>💼 Профессиональная информация</h3>
            <div className="form-group">
              <label>Специализация</label>
              <select
                value={profileData.category}
                onChange={(e) => setProfileData({...profileData, category: e.target.value})}
              >
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
                placeholder="Расскажите о вашем опыте, специализации и достижениях..."
                rows="4"
              />
              <div className="char-count">{profileData.bio.length}/500</div>
            </div>

            <div className="form-group">
              <label>Почасовая ставка (₽)</label>
              <input
                type="number"
                value={profileData.hourlyRate}
                onChange={(e) => setProfileData({...profileData, hourlyRate: e.target.value})}
                placeholder="1000"
                min="500"
                max="10000"
              />
            </div>
          </div>
        )}

        {/* Ссылки и контакты только для фрилансеров */}
        {user?.role === 'freelancer' && (
          <div className="form-section">
            <h3>🔗 Ссылки и контакты</h3>
            <div className="form-group">
              <label>Веб-сайт / Портфолио</label>
              <input
                type="url"
                value={profileData.website}
                onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                placeholder="https://example.com"
              />
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? (
              <>
                <div className="loading-spinner-small"></div>
                Сохранение...
              </>
            ) : (
              '💾 Сохранить изменения'
            )}
          </button>
        </div>
      </form>
    </div>
  )

  const renderSecurityTab = () => (
    <div className="settings-tab">
      <div className="tab-header">
        <h2>Безопасность аккаунта</h2>
        <p>Защитите ваш аккаунт и управляйте доступом</p>
      </div>

      <form onSubmit={handleSecuritySave}>
        <div className="form-section">
          <h3>🔑 Смена пароля</h3>
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
          <h3>🛡️ Дополнительная защита</h3>
          
          <div className="security-feature">
            <div className="feature-info">
              <h4>Двухфакторная аутентификация</h4>
              <p>Добавьте дополнительный уровень безопасности к вашему аккаунту</p>
              <div className="feature-status">
                <span className="status-badge disabled">Не активирована</span>
              </div>
            </div>
            <button type="button" className="btn btn-outline">
              Активировать
            </button>
          </div>

          <div className="security-feature">
            <div className="feature-info">
              <h4>Активные сессии</h4>
              <p>Управляйте устройствами, на которых выполнен вход</p>
              <div className="feature-status">
                <span className="status-badge">1 активная сессия</span>
              </div>
            </div>
            <button type="button" className="btn btn-outline">
              Управлять
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Сохранение...' : '🔒 Обновить пароль'}
          </button>
        </div>
      </form>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="settings-tab">
      <div className="tab-header">
        <h2>Уведомления</h2>
        <p>Настройте как и когда вы получаете уведомления</p>
      </div>

      <form onSubmit={handleNotificationSave}>
        <div className="form-section">
          <h3>📧 Email уведомления</h3>
          
          <div className="notification-item">
            <div className="notification-info">
              <h4>Уведомления о проектах</h4>
              <p>Новые проекты, отклики и обновления по вашим проектам</p>
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
              <h4>Сообщения и чаты</h4>
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
              <h4>Еженедельный дайджест</h4>
              <p>Сводка активности за неделю</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notificationSettings.weeklyDigest}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  weeklyDigest: e.target.checked
                })}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>📱 Push-уведомления</h3>
          
          <div className="notification-item">
            <div className="notification-info">
              <h4>Desktop уведомления</h4>
              <p>Показывать уведомления на рабочем столе</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notificationSettings.desktopNotifications}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  desktopNotifications: e.target.checked
                })}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="notification-info">
              <h4>SMS оповещения</h4>
              <p>Важные уведомления по SMS</p>
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

        <div className="form-section">
          <h3>🎯 Маркетинг</h3>
          <div className="notification-item">
            <div className="notification-info">
              <h4>Специальные предложения</h4>
              <p>Получать новости и специальные предложения от платформы</p>
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

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Сохранение...' : '💾 Сохранить настройки'}
          </button>
        </div>
      </form>
    </div>
  )

  const renderAppearanceTab = () => (
    <div className="settings-tab">
      <div className="tab-header">
        <h2>Внешний вид</h2>
        <p>Настройте внешний вид платформы под свои предпочтения</p>
      </div>

      <form onSubmit={handleNotificationSave}>
        <div className="form-section">
          <h3>🎨 Тема оформления</h3>
          
          <div className="theme-selector">
            <div className="theme-option">
              <input
                type="radio"
                id="theme-dark"
                name="theme"
                value="dark"
                checked={appearanceSettings.theme === 'dark'}
                onChange={(e) => setAppearanceSettings({...appearanceSettings, theme: e.target.value})}
              />
              <label htmlFor="theme-dark" className="theme-label">
                <div className="theme-preview dark-theme"></div>
                <span>Темная</span>
              </label>
            </div>

            <div className="theme-option">
              <input
                type="radio"
                id="theme-light"
                name="theme"
                value="light"
                checked={appearanceSettings.theme === 'light'}
                onChange={(e) => setAppearanceSettings({...appearanceSettings, theme: e.target.value})}
              />
              <label htmlFor="theme-light" className="theme-label">
                <div className="theme-preview light-theme"></div>
                <span>Светлая</span>
              </label>
            </div>

            <div className="theme-option">
              <input
                type="radio"
                id="theme-auto"
                name="theme"
                value="auto"
                checked={appearanceSettings.theme === 'auto'}
                onChange={(e) => setAppearanceSettings({...appearanceSettings, theme: e.target.value})}
              />
              <label htmlFor="theme-auto" className="theme-label">
                <div className="theme-preview auto-theme"></div>
                <span>Системная</span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>📐 Размер текста</h3>
          <div className="form-group">
            <select
              value={appearanceSettings.fontSize}
              onChange={(e) => setAppearanceSettings({...appearanceSettings, fontSize: e.target.value})}
            >
              <option value="small">Маленький</option>
              <option value="medium">Средний</option>
              <option value="large">Большой</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>🌐 Язык</h3>
          <div className="form-group">
            <select
              value={appearanceSettings.language}
              onChange={(e) => setAppearanceSettings({...appearanceSettings, language: e.target.value})}
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>⚙️ Дополнительные настройки</h3>
          
          <div className="notification-item">
            <div className="notification-info">
              <h4>Компактный режим</h4>
              <p>Уменьшить отступы для большего количества контента на экране</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={appearanceSettings.compactMode}
                onChange={(e) => setAppearanceSettings({
                  ...appearanceSettings,
                  compactMode: e.target.checked
                })}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Сохранение...' : '💾 Применить настройки'}
          </button>
        </div>
      </form>
    </div>
  )

  // Убираем вкладку платежей полностью

  const renderPrivacyTab = () => (
    <div className="settings-tab">
      <div className="tab-header">
        <h2>Конфиденциальность</h2>
        <p>Управляйте вашими настройками конфиденциальности и данными</p>
      </div>

      <form onSubmit={handleNotificationSave}>
        <div className="form-section">
          <h3>👁️ Видимость профиля</h3>
          
          <div className="notification-item">
            <div className="notification-info">
              <h4>Публичный профиль</h4>
              <p>Разрешить другим пользователям просматривать ваш профиль</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="notification-info">
              <h4>Показывать онлайн-статус</h4>
              <p>Отображать когда вы онлайн для других пользователей</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>

          {user?.role === 'freelancer' && (
            <div className="notification-item">
              <div className="notification-info">
                <h4>Показывать почасовую ставку</h4>
                <p>Отображать вашу ставку в публичном профиле</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>📨 Конфиденциальность сообщений</h3>
          
          <div className="notification-item">
            <div className="notification-info">
              <h4>Принимать сообщения от всех</h4>
              <p>Разрешить получать сообщения от любых пользователей</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="notification-info">
              <h4>Фильтр спам-сообщений</h4>
              <p>Автоматически фильтровать подозрительные сообщения</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>🗑️ Управление данными</h3>
          
          <div className="privacy-action">
            <div className="action-info">
              <h4>Экспорт данных</h4>
              <p>Скачайте копию ваших данных с платформы</p>
            </div>
            <button className="btn btn-outline">📥 Экспортировать данные</button>
          </div>

          <div className="privacy-action">
            <div className="action-info">
              <h4>Удаление аккаунта</h4>
              <p>Полностью удалите ваш аккаунт и все данные</p>
              <p className="warning-text">Это действие нельзя отменить!</p>
            </div>
            <button className="btn btn-danger">🗑️ Удалить аккаунт</button>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Сохранение...' : '💾 Сохранить настройки'}
          </button>
        </div>
      </form>
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
        <p>Персонализируйте вашу работу на платформе</p>
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
          {activeTab === 'appearance' && renderAppearanceTab()}
          {activeTab === 'privacy' && renderPrivacyTab()}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage