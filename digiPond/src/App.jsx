import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import CanvasComponent from './canvasComponent';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <CanvasComponent />
    </>
  )
}

export default App
