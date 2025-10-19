import './App.scss'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage/ProjectsPage'
import AboutPage from './pages/AboutPage/AboutPage'
import RulesPage from './pages/RulesPage/RulesPage'
import SafetyPage from './pages/SafetyPage/SafetyPage'
import AuthPage from './pages/AuthPage/AuthPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/safety" element={<SafetyPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App