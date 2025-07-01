import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginPage from './Pages/LoginPage'
import { Route, Routes } from 'react-router-dom'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      <Route path="/login" element= {<LoginPage/>}/>
      
    </Routes>
    </>
  )
}

export default App
