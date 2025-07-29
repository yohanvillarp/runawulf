import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'


interface ModuleCardProps {
  title: string
  icon: LucideIcon
  to: string
  asButton?: boolean
  onClick?: () => void
}

export const ModuleCard = ({ title, icon: IconComponent, to, asButton = false, onClick }: ModuleCardProps) => {
  const sharedClasses =
    'flex flex-col items-center justify-center w-48 h-48 p-4 m-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-200 hover:bg-gray-100 text-center'

    const content = (
    <>
      <IconComponent size={48} className="text-blue-600 mb-4" />
      <h2 className="text-lg font-semibold">{title}</h2>
    </>
  )

  return asButton ? (
    <button onClick={onClick} className={sharedClasses}>
      {content}
    </button>
  ) : (
    <Link to={to} className={sharedClasses}>
      {content}
    </Link>
  )
}
