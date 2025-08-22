import type { ReactNode } from "react"

interface TitleProps {
  children: ReactNode
  actions?: ReactNode
}

export default function Title({ children, actions }: TitleProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-4xl font-bold text-gray-800 font-serif tracking-tight">
        {children}
      </h1>
      {actions && <div>{actions}</div>}
    </div>
  )
}
