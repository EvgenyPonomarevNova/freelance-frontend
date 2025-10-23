import './CreateProjectPage.scss'
import CreateProjectForm from '../../components/CreateProjectForm/CreateProjectForm'
import { useNavigate } from 'react-router-dom'

function CreateProjectPage() {
  const navigate = useNavigate()

  const handleSuccess = () => {
    alert('Проект успешно создан!')
    navigate('/projects')
  }

  const handleCancel = () => {
    navigate('/projects')
  }

  return (
    <div className="create-project-page">
      <div className="page-container">
        <CreateProjectForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}

export default CreateProjectPage