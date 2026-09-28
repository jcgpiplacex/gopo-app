import type { ReactNode } from 'react'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: ReactNode
  title?: string
}

export default function Layout({ children, title }: LayoutProps) {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        {title && (
          <div className="h-12 border-b border-slate-200 flex items-center px-6 bg-white">
            <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
          </div>
        )}
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}