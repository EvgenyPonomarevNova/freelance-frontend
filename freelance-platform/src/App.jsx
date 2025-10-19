import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className="app">
      <h1>🎉 Успех! React работает!</h1>
      <p>Моя биржа фриланса начинается здесь</p>
      <div className="project-card">
        <h3>Первый проект</h3>
        <p>Создать логотип для кофейни</p>
        <button>Откликнуться</button>
      </div>
    </div>
  )
}

export default App