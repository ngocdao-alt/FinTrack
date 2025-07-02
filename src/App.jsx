
import './App.css'
import LoginPage from './Pages/LoginPage'
import LandingPages from './Pages/LandingPage'
import { Route, Routes } from 'react-router-dom'


function App() {
  

  return (
    <>
    <Routes>
      {/* <Route path="/login" element={<LoginPages />} /> */}
      <Route path="/landing" element={<LandingPages />} />
    </Routes>
    </>
  )
}

export default App
