import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
};

const ProtectedRoute =({ children }: Props) => {  
    const isConfigured = localStorage.getItem('configured') === 'true'
    return isConfigured ? children : <Navigate to="/initial-setup" />
}

export default ProtectedRoute