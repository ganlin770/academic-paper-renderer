import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Users, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Papers',
      value: '12',
      description: '+2 from last month',
      icon: FileText,
      trend: 'up'
    },
    {
      title: 'Collaborations',
      value: '8',
      description: '+1 from last week', 
      icon: Users,
      trend: 'up'
    },
    {
      title: 'Hours Written',
      value: '47',
      description: '+12 from last week',
      icon: Clock,
      trend: 'up'
    },
    {
      title: 'Papers Published',
      value: '3',
      description: '+1 from last month',
      icon: TrendingUp,
      trend: 'up'
    }
  ]

  const recentPapers = [
    {
      id: '1',
      title: 'Machine Learning in Healthcare: A Comprehensive Review',
      lastModified: '2 hours ago',
      status: 'draft',
      collaborators: 3
    },
    {
      id: '2', 
      title: 'Quantum Computing Applications in Cryptography',
      lastModified: '1 day ago',
      status: 'published',
      collaborators: 1
    },
    {
      id: '3',
      title: 'Sustainable Energy Solutions for Urban Development',
      lastModified: '3 days ago',
      status: 'review',
      collaborators: 5
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your academic work.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/papers/new">
            <FileText className="mr-2 h-4 w-4" />
            New Paper
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Papers */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Papers</CardTitle>
            <CardDescription>
              Your most recently modified papers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPapers.map((paper) => (
              <div key={paper.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium leading-none">
                    {paper.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Last modified {paper.lastModified} • {paper.collaborators} collaborators
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    paper.status === 'published' 
                      ? 'bg-green-100 text-green-700' 
                      : paper.status === 'review'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {paper.status}
                  </span>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/papers/${paper.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/papers">
                View All Papers
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Get started with common tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link href="/dashboard/papers/new">
                <FileText className="mr-2 h-4 w-4" />
                Create New Paper
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/templates">
                <FileText className="mr-2 h-4 w-4" />
                Browse Templates
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/shared">
                <Users className="mr-2 h-4 w-4" />
                View Shared Papers
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/settings">
                <FileText className="mr-2 h-4 w-4" />
                Account Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}