import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Papu from './Components/Papu';
import Home from './Home';
import Card from './Components/Card';

const App = () => {
  return (
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="papu" element={<Papu />} />
    <Route path="card" element={<Card />} />
    
  </Routes>
  )
}

export default App