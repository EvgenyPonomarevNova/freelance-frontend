import './ProfileSetupPage.scss'
import { useState } from 'react'
import { useUser } from '../../contexts/UserContext'
import { useNavigate } from 'react-router-dom'

function ProfileSetupPage() {
  const { user, updateProfile } = useUser()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    title: user?.profile?.title || '',
    description: user?.profile?.description || '',
    hourlyRate: user?.profile?.hourlyRate || '',
    location: user?.profile?.location || '',
    experience: user?.profile?.experience || ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateProfile(formData)
    navigate('/profile')
  }

  const skipSetup = () => {
    navigate('/profile')
  }

  if (!user) {
    return <div>Загрузка...</div>
  }

  return (
    <div className="profile-setup-page">
      <div className="setup-container">
        <div className="setup-header">
          <h1>Настройте ваш профиль</h1>
          <p>Расскажите о себе, чтобы привлекать больше клиентов</p>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="form-section">
            <h2>Основная информация</h2>
            
            <div className="form-group">
              <label>Специализация</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Например: Frontend Developer"
              />
            </div>

            <div className="form-group">
              <label>О себе</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Расскажите о вашем опыте и специализации..."
                rows="4"
              />
            </div>

            {user.role === 'freelancer' && (
              <div className="form-group">
                <label>Ставка в час (₽)</label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  placeholder="1500"
                />
              </div>
            )}

            <div className="form-group">
              <label>Местоположение</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Город, страна"
              />
            </div>

            <div className="form-group">
              <label>Опыт работы</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Например: 3 года"
              />
            </div>
          </div>

          <div className="setup-actions">
            <button type="submit" className="save-btn">
              Сохранить и продолжить
            </button>
            <button type="button" className="skip-btn" onClick={skipSetup}>
              Пропустить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileSetupPage