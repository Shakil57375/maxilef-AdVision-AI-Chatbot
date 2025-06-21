"use client"

import { Navigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"

export function PrivateRoute({ children }) {
  const user = useSelector((state) => state.auth.user)
  const accessToken = useSelector((state) => state.auth.accessToken)
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Give a moment for the persisted state to rehydrate
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Show loading while checking authentication state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Check if user is not authenticated
  if (!user || !accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
