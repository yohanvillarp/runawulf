import { useLocation, Outlet, Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const routeLabels: Record<string, string> = {
  'monitor': 'Monitor de Sistema',
  'users': 'Gestión de Usuarios',
  'activity-log': 'Historial de Actividad',

  'access-control': 'Control de Acceso',
  'connected': 'Usuarios conectados',

  'notifications': 'Notificaciones',
  'network-status': 'Estado de Red',
  'updates': 'Actualizaciones',
  'support': 'Soporte',
  'setup': 'Configuración',
}

export default function DashboardLayout() {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4 flex items-center space-x-1">
        <Link to="/" className="text-gray-600 hover:text-blue-600 flex items-center space-x-1">
          <Home className="w-4 h-4" />
          <span className="ml-1">Inicio</span>
        </Link>
        {segments.map((seg, index) => {
          const path = '/' + segments.slice(0, index + 1).join('/')
          const isLast = index === segments.length - 1
          return (
            <span key={index} className="flex items-center space-x-1">
              <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
              {isLast ? (
                <span className="text-gray-800 font-medium">{routeLabels[seg] || seg}</span>
              ) : (
                <Link to={path} className="hover:underline text-gray-600 hover:text-blue-600">
                  {routeLabels[seg] || seg}
                </Link>
              )}
            </span>
          )
        })}
      </nav>

      {/* Página hija */}
      <Outlet />
    </div>
  )
}
