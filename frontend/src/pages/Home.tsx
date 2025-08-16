import { ModuleCard } from '../components/ModuleCard'
import { Cpu, Settings, LogOut, Clock, Key, Database, Shield, HelpCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useWebSocket } from '../context/useWebSocket'

export default function Home() {

  const navigate = useNavigate()
  const { disconnect } = useWebSocket()

  const handleClick = () => {
    disconnect()
    localStorage.removeItem('ipServer')
    localStorage.removeItem('userServer')
    localStorage.removeItem('connected')
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
        {/* Administración y seguridad */}
        <ModuleCard title="Monitor de Sistema" icon={Cpu} to="/system-monitor" />
        <ModuleCard title="Control de Firewall" icon={Key} to="/firewall-control" />
        <ModuleCard title="Copias de Seguridad" icon={Database} to="/backup" />
        <ModuleCard title="Detección de Intrusos" icon={Shield} to="/intrusion-detection" />

        {/* Gestión y registros */}
        <ModuleCard title="Historial de Actividad" icon={Clock} to="/activity-log" />
        <ModuleCard title="Soporte" icon={HelpCircle} to="/support" />
        <ModuleCard title="Configuración" icon={Settings} to="/setup" />

        {/* Cierre de sesión */}
        <ModuleCard
          title="Cerrar sesión"
          icon={LogOut}
          to="/initial-setup"
          asButton
          onClick={handleClick}
        />
      </div>
    </div>
  )
}