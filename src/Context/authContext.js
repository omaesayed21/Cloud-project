import React, { createContext, useContext, useState, useEffect } from 'react'

export const authContext = createContext()

export default function AuthContextProvider({ children }) {
  const [myToken, setMyToken] = useState(null)

  // جلب التوكن من localStorage عند تحميل التطبيق
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setMyToken(token)
    }
  }, [])

  // حفظ التوكن في localStorage
  const saveToken = (token) => {
    localStorage.setItem('token', token)
    setMyToken(token)
  }

  // إزالة التوكن عند تسجيل الخروج
  const logout = () => {
    localStorage.removeItem('token')
    setMyToken(null)
  }

  return (
    <authContext.Provider value={{ myToken, saveToken, logout }}>
      {children}
    </authContext.Provider>
  )
}
