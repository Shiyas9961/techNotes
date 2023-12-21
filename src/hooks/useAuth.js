import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../features/auth/authSlice'
import { jwtDecode } from 'jwt-decode'

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isManager = false
    let isAdmin = false
    let status = "Employee"

    if(token){
        const { username, roles } = jwtDecode(token).userInfo

        isAdmin = roles.includes("Admin")
        isManager = roles.includes("Manager")

        if(isManager) status = "Manager"
        if(isAdmin) status = "Admin"

        return { username, roles, status, isManager, isAdmin }
    }

  return { username : "", roles : [], isManager, isAdmin, status }
}

export default useAuth