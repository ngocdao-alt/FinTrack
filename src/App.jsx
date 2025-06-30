import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className='text-xl text-slate-500'>
        CON CAC FONT THUONG
      </h1>

      <h1 className='font-serif text-xl'>
        CON CAC FONT ROBOTO
      </h1>
    </>
  )
}

export default App
