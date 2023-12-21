import React from 'react'
import useAuth from '../../hooks/useAuth'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const Required = ({ allowedRoles }) => {

    const { roles } = useAuth()
    const location = useLocation()

  return roles.some(role => allowedRoles.includes(role)) ? <Outlet/> : <Navigate to='/login' state={{ from : location }} replace />
}

export default Required