import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.scss'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <h2>Добро пожаловать на биржу фриланса!</h2>
        {/* Здесь будет основной контент */}
      </main>
      <Footer />
    </div>
  )
}

export default App