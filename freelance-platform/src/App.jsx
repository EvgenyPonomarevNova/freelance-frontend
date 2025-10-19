import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.scss'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import HomePage from './pages/HomePage'

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <HomePage />
      </main>
      <Footer />
    </div>
  )
}

export default App