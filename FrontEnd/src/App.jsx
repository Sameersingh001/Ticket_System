import React from 'react'
import RegisterPage from './AuthComponents/RegisterPage'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Login from './AuthComponents/LoginPage'
import Dashboard from './Pages/Dashboard'
import AddSeat from './Pages/SeatAdded'

const App = () => {
  return (
    <div>
      
      <Router>
        <Routes>

        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/seat-adder" element={<AddSeat />} />

        <Route path="/dashboard" element={<Dashboard />} />

        
        </Routes>
      </Router>

    </div>
  )
}

export default App