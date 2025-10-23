import "./App.scss";
import { UserProvider } from "./contexts/UserContext";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage/ProjectsPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import RulesPage from "./pages/RulesPage/RulesPage";
import SafetyPage from "./pages/SafetyPage/SafetyPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import CreateProjectPage from "./pages/CreateProjectPage/CreateProjectPage";
import ChatPage from "./pages/ChatPage/ChatPage";
import FreelancersPage from "./pages/FreelancersPage/FreelancersPage";
import FreelancerProfilePage from "./pages/FreelancerProfilePage/FreelancerProfilePage";
import HowItWorksPage from './pages/HowItWorksPage/HowItWorksPage'
import MyProjectsPage from './pages/MyProjectsPage/MyProjectsPage'
import SettingsPage from './pages/SettingsPage/SettingsPage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <UserProvider>
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
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile-setup" element={<ProfilePage />} />
            <Route path="/create-project" element={<CreateProjectPage />} />
            <Route path="/chat/:projectId" element={<ChatPage />} />
            <Route path="/freelancers" element={<FreelancersPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/my-projects" element={<MyProjectsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route
              path="/profile/:freelancerId"
              element={<FreelancerProfilePage />}
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
