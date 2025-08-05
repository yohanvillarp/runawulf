import { Navigate, Outlet } from 'react-router-dom'
import { useWebSocket } from '../context/useWebSocket'
import Loader from '../components/Loader'

const ProtectedRoute =() => {  
    const { isConnected, isConnecting } = useWebSocket();

    if(isConnecting){
        return <Loader message="Conectando al servidor..."/>
    }

    //si no hay conexión activa redirige a la página de configuración inicial
    
    if(!isConnected){
        return <Navigate to="/initial-setup" replace/>
    }

    return <Outlet />
}

export default ProtectedRoute