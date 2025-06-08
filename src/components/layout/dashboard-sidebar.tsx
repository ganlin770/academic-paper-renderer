'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  FileText, 
  Home, 
  PlusCircle, 
  FolderOpen, 
  Users, 
  Settings, 
  BookOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import type { User } from '@/types'

interface DashboardSidebarProps {
  user: User
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      exact: true,
    },
    {
      name: 'My Papers',
      href: '/dashboard/papers',
      icon: FileText,
    },
    {
      name: 'Shared with Me',
      href: '/dashboard/shared',
      icon: Users,
    },
    {
      name: 'Templates',
      href: '/dashboard/templates',
      icon: BookOpen,
    },
    {
      name: 'Recent',
      href: '/dashboard/recent',
      icon: FolderOpen,
    },
  ]

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className={cn(
      "flex flex-col bg-white dark:bg-gray-900 border-r transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-lg">Academic</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* New Paper Button */}
      <div className="p-4">
        <Button 
          asChild 
          className={cn(
            "w-full justify-start",
            isCollapsed && "px-2"
          )}
        >
          <Link href="/dashboard/papers/new">
            <PlusCircle className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">New Paper</span>}
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive(item.href, item.exact)
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800",
                isCollapsed && "justify-center px-2"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="ml-3">{item.name}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t">
        {!isCollapsed && (
          <div className="text-xs text-muted-foreground mb-2">
            Signed in as
          </div>
        )}
        <div className={cn(
          "flex items-center space-x-3",
          isCollapsed && "justify-center"
        )}>
          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-700">
              {user.display_name.charAt(0).toUpperCase()}
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.display_name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </p>
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="w-full justify-start mt-3"
          >
            <Link href="/dashboard/settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}