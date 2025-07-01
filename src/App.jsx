// src/App.jsx
import { useState } from 'react'
import './App.css'
import LoginPage from './Pages/LoginPage'
import LandingPage from './Pages/LandingPage'
import Sidebar from './components/SideBarComponent'
import { Routes, Route, useLocation } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)      
  const location = useLocation()

  const hideSidebar = location.pathname === '/login' || location.pathname === '/register'

  return (
    <div className="flex">
      {!hideSidebar && <Sidebar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/register" element={<RegisterPage />} /> */}
        </Routes>
      </div>
    </div>
  )
}

export default App
