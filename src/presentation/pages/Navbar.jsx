import { Link, useLocation, useNavigate } from "react-router-dom"

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  if (location.pathname === "/login" || location.pathname === "/Register") {
    return null  
  }

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-green-600">Smart Budget</h1>

        <ul className="flex space-x-6 text-sm font-medium text-gray-700">
          <li><Link to="/dashboard" className="hover:text-green-600">Dashboard</Link></li>
          <li><Link to="/wallets" className="hover:text-green-600">Wallets</Link></li>
          <li><Link to="/Trnsactions" className="hover:text-green-600">Transactions</Link></li>
          <li><Link to="/budget" className="hover:text-green-600">Budget</Link></li>
          <li><Link to="/reports" className="hover:text-green-600">Reports</Link></li>
        </ul>

        <button
          onClick={logout}
          className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700  cursor-pointer"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
