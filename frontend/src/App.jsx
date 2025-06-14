import React from 'react'
import Chat from './components/Chat'
import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import Ai from './pages/Ai'
import Navbar from './components/Navbar'
import VoiceAssistant from './components/VoiceAssistant'
import Test from './components/Test'

const App = () => {
  return (
    <div>
      <Navbar></Navbar>
      <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/chat' element={<Ai/>}/>
      </Routes>
      </>
    </div>
  )
}

export default App