import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes , Route } from 'react-router-dom'
import Login from './presentation/pages/Login'
import Register from './presentation/pages/Register'
import Dashboard from './presentation/pages/Dashbord'
import PrivateRoute from './presentation/Routes/PrivateRoute'
import { useEffect } from 'react'
import Transactions from './presentation/pages/Transactions'
import Navbar from './presentation/pages/Navbar'
import Wallets from './presentation/pages/Wallet'
// import Budget from './presentation/pages/Budget'
function App() {
  // const [count, setCount] = useState(0)

  return (
<>

<BrowserRouter>
<Navbar/>
    <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/Login" element={<Login />} />
    <Route path="/Register" element={<Register />} />
    <Route path="/Trnsactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
      <Route path="/dashboard"
       element={<PrivateRoute><Dashboard /></PrivateRoute>} />
       <Route path="/Wallets" element={<PrivateRoute><Wallets /></PrivateRoute>} />
    {/* <Route path='/Budget' element ={<PrivateRoute><Budget/> </PrivateRoute>} /> */}

    </Routes>
    
</BrowserRouter>
 </>
  )
}

export default App
