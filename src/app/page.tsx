import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  FileText, 
  Calculator, 
  BarChart3, 
  Users, 
  GitBranch, 
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: FileText,
      title: 'Markdown 编辑器',
      description: '支持实时预览的富文本编辑器，专为学术写作优化'
    },
    {
      icon: Calculator,
      title: 'LaTeX 公式渲染',
      description: '完整支持数学公式和符号，让复杂公式呈现更专业'
    },
    {
      icon: BarChart3,
      title: 'SVG 图表渲染',
      description: '直接渲染SVG代码生成高质量图表和示意图'
    },
    {
      icon: Users,
      title: '协作功能',
      description: '支持多人协作编辑和评论，提升团队写作效率'
    },
    {
      icon: GitBranch,
      title: '版本管理',
      description: '完整的版本历史追踪，轻松管理论文修改过程'
    },
    {
      icon: Zap,
      title: '实时预览',
      description: '所见即所得的编辑体验，即时查看渲染效果'
    }
  ]

  const benefits = [
    '🎯 专业的学术论文写作环境',
    '⚡ 高性能实时渲染引擎',
    '🔒 安全的用户数据保护',
    '📱 完美的跨平台体验',
    '🌙 支持深色模式',
    '📊 丰富的导出格式'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Academic Paper Renderer
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-gray-600 hover:text-blue-600 dark:text-gray-300">
              功能特性
            </Link>
            <Link href="#benefits" className="text-gray-600 hover:text-blue-600 dark:text-gray-300">
              产品优势
            </Link>
            <Link href="#getting-started" className="text-gray-600 hover:text-blue-600 dark:text-gray-300">
              快速开始
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">登录</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">
                开始使用
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              专业的
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                学术论文
              </span>
              <br />写作平台
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
              支持 Markdown 编辑、LaTeX 公式、SVG 图表的专业学术写作工具。
              <br />
              让您专注于内容创作，我们负责完美呈现。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="text-lg px-8 py-4" asChild>
                <Link href="/auth/signup">
                  免费开始使用
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4" asChild>
                <Link href="/demo">
                  查看演示
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              强大的功能特性
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              我们提供一站式的学术论文写作解决方案，让您的研究成果得到最佳呈现
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                      <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                为什么选择我们
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                专为学术研究者设计的专业写作平台
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <span className="text-lg text-gray-900 dark:text-white">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="getting-started" className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              准备开始您的学术写作之旅？
            </h2>
            <p className="text-xl text-blue-100 mb-12">
              加入我们，体验专业的学术论文写作平台，让您的研究成果完美呈现
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100" asChild>
                <Link href="/auth/signup">
                  立即注册
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600" asChild>
                <Link href="/docs">
                  查看文档
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold">Academic Paper Renderer</span>
              </div>
              <p className="text-gray-400">
                专业的学术论文写作和渲染平台
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">产品</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white">功能特性</Link></li>
                <li><Link href="/pricing" className="hover:text-white">价格方案</Link></li>
                <li><Link href="/demo" className="hover:text-white">在线演示</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">支持</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/docs" className="hover:text-white">使用文档</Link></li>
                <li><Link href="/help" className="hover:text-white">帮助中心</Link></li>
                <li><Link href="/contact" className="hover:text-white">联系我们</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">公司</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">关于我们</Link></li>
                <li><Link href="/blog" className="hover:text-white">技术博客</Link></li>
                <li><Link href="/careers" className="hover:text-white">加入我们</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Academic Paper Renderer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}