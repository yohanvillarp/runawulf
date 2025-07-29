import { ModuleCard } from '../components/ModuleCard'
import { Cpu, Settings, User, LogOut, Clock, Key, Bell, Network, RefreshCw, HelpCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Home() {

  const navigate = useNavigate()

  const handleClick = () => {
    localStorage.removeItem('configured')
    localStorage.removeItem('ipServer')
    localStorage.removeItem('userServer')
    navigate('/initial-setup')
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 p-6">
      <h1 className="mb-10 text-4xl font-extrabold text-gray-900 dark:text-white md:text-5xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-600">
          Centro de control
        </span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        <ModuleCard title="Monitor de Sistema" icon={Cpu} to="/monitor" />
        <ModuleCard title="Gestión de Usuarios" icon={User} to="/users" />
        <ModuleCard title="Historial de Actividad" icon={Clock} to="/activity-log" />
        <ModuleCard title="Control de Acceso" icon={Key} to="/access-control" />
        <ModuleCard title="Notificaciones" icon={Bell} to="/notifications" />
        <ModuleCard title="Estado de Red" icon={Network} to="/network-status" />
        <ModuleCard title="Actualizaciones" icon={RefreshCw} to="/updates" />
        <ModuleCard title="Soporte" icon={HelpCircle} to="/support" />
        <ModuleCard title="Configuración" icon={Settings} to="/setup" />
        <ModuleCard title="Cerrar sesión" icon={LogOut} to="/initial-setup" asButton onClick={handleClick} />

      </div>
    </div>
  )
}