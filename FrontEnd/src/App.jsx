import React from 'react'
import RegisterPage from './AuthComponents/RegisterPage'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Login from './AuthComponents/LoginPage'
import SeatBooking from './Pages/SeatBokoing'

const App = () => {
  return (
    <div>
      
      <Router>
        <Routes>

        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<SeatBooking />} />

        
        </Routes>
      </Router>

    </div>
  )
}

export default App