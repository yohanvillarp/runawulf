import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute =() => {  
    const isConfigured = localStorage.getItem('configured') === 'true'
    return isConfigured ? <Outlet /> : <Navigate to="/initial-setup" />
}

export default ProtectedRoute