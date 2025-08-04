import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'


interface ModuleCardProps {
  title: string
  icon: LucideIcon
  to: string
  description?: string
  asButton?: boolean
  onClick?: () => void
}

export const ModuleCard = ({
  title,
  icon: Icon,
  to,
  description,
  asButton = false,
  onClick,
}: ModuleCardProps) => {
  const sharedClasses = `
    flex flex-col justify-center items-center gap-3
    w-full max-w-xs min-h-[17rem]
    bg-white rounded-2xl shadow-md hover:shadow-xl
    transition-transform duration-200 hover:scale-[1.02]
    text-center border border-gray-100 hover:border-gray-300
  `

  const content = (
    <>
      <Icon size={40} className="text-blue-600" />
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {description && <p className="text-sm text-gray-600">{description}</p>}
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
