# 📚 Academic Paper Renderer

一个专业的学术论文写作和渲染平台，支持 Markdown 编辑、LaTeX 公式、SVG 图表，具备完整的用户系统和版本管理功能。

## ✨ 功能特性

### 🎯 核心功能
- **📝 Markdown 编辑器**: 支持实时预览的富文本编辑器
- **🧮 LaTeX 公式渲染**: 完整支持数学公式和符号
- **📊 SVG 图表渲染**: 直接渲染 SVG 代码生成高质量图表
- **👁️ 实时预览**: 所见即所得的编辑体验
- **📥 多格式导出**: 支持 PDF、HTML、Markdown 格式导出

### 👥 用户系统
- **🔐 安全认证**: 基于 Supabase Auth 的完整用户系统
- **👤 个人工作空间**: 每个用户独立的论文管理空间
- **🤝 协作功能**: 支持多人协作编辑和评论
- **🛡️ 权限管理**: 灵活的访问权限控制

### 🔄 版本管理
- **📚 版本控制**: 完整的论文版本历史追踪
- **🔍 差异对比**: 版本间内容变更可视化
- **↩️ 回滚功能**: 轻松恢复到任意历史版本
- **🏷️ 标签系统**: 为重要版本添加标签标记

### 🎨 界面设计
- **🌙 深色模式**: 支持浅色/深色主题切换
- **📱 响应式设计**: 完美适配桌面端和移动端
- **⚡ 性能优化**: 基于 Next.js 14 的极速加载体验
- **🎯 直观交互**: 符合学术写作习惯的用户界面

## 🏗️ 技术架构

### 前端技术栈
```
Next.js 14 (App Router)    # React 全栈框架
TypeScript                # 类型安全的 JavaScript
Tailwind CSS              # 原子化 CSS 框架
React Hook Form           # 高性能表单处理
Zustand                   # 轻量级状态管理
Monaco Editor             # VS Code 编辑器内核
```

### 后端技术栈
```
Supabase                  # 后端即服务 (BaaS)
├── PostgreSQL           # 关系型数据库
├── Auth                 # 用户认证系统
├── Storage              # 文件存储服务
├── Real-time            # 实时数据同步
└── Edge Functions       # 服务端逻辑
```

### 渲染引擎
```
react-markdown            # Markdown 渲染
KaTeX                     # LaTeX 数学公式
SVG                       # 矢量图形渲染
Prism.js                  # 代码语法高亮
```

### 部署平台
```
Vercel                    # 前端部署平台
├── Edge Runtime         # 边缘计算
├── Serverless Functions # 无服务器函数
└── CDN                  # 全球内容分发
```

## 📊 数据模型设计

### 核心实体关系
```sql
-- 用户表
users {
  id: uuid (PK)
  email: string
  display_name: string
  avatar_url: string
  created_at: timestamp
  updated_at: timestamp
}

-- 论文表
papers {
  id: uuid (PK)
  title: string
  content: text
  author_id: uuid (FK -> users.id)
  is_public: boolean
  created_at: timestamp
  updated_at: timestamp
}

-- 版本表
paper_versions {
  id: uuid (PK)
  paper_id: uuid (FK -> papers.id)
  content: text
  version_name: string
  commit_message: text
  created_at: timestamp
  created_by: uuid (FK -> users.id)
}

-- 协作者表
paper_collaborators {
  id: uuid (PK)
  paper_id: uuid (FK -> papers.id)
  user_id: uuid (FK -> users.id)
  role: enum('viewer', 'editor', 'admin')
  invited_at: timestamp
  accepted_at: timestamp
}
```

## 🚀 快速开始

### 环境要求
```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### 1. 克隆项目
```bash
git clone https://github.com/your-username/academic-paper-renderer.git
cd academic-paper-renderer
```

### 2. 安装依赖
```bash
npm install
```

### 3. 环境配置
创建 `.env.local` 文件：
```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. 数据库初始化
```bash
# 运行数据库迁移
npm run db:migrate

# 生成类型定义
npm run db:types
```

### 5. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000 查看应用

## 📁 项目结构

```
academic-paper-renderer/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 认证相关页面
│   ├── (dashboard)/              # 主应用页面
│   │   ├── papers/               # 论文管理
│   │   └── editor/               # 编辑器页面
│   ├── api/                      # API 路由
│   ├── globals.css               # 全局样式
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 首页
├── components/                   # React 组件
│   ├── ui/                       # 基础 UI 组件
│   ├── editor/                   # 编辑器组件
│   ├── auth/                     # 认证组件
│   └── layout/                   # 布局组件
├── lib/                          # 工具库
│   ├── supabase/                 # Supabase 客户端
│   ├── utils/                    # 通用工具函数
│   └── validations/              # 数据验证
├── hooks/                        # 自定义 React Hooks
├── store/                        # 状态管理
├── types/                        # TypeScript 类型定义
├── public/                       # 静态资源
└── supabase/                     # Supabase 配置
    ├── migrations/               # 数据库迁移
    └── functions/                # Edge Functions
```

## 🛠️ 开发指南

### 代码规范
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **Husky**: Git hooks 管理
- **Conventional Commits**: 提交信息规范

### 开发命令
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查
npm run type-check   # 类型检查
npm run test         # 运行测试
```

### 数据库操作
```bash
npm run db:migrate   # 运行迁移
npm run db:reset     # 重置数据库
npm run db:types     # 生成类型
npm run db:seed      # 填充测试数据
```

## 🔌 核心功能实现

### 1. Markdown 编辑器
```typescript
// 基于 Monaco Editor 的 Markdown 编辑器
import { Editor } from '@monaco-editor/react';
import { markdownLanguage } from './markdown-language';
```

### 2. LaTeX 公式渲染
```typescript
// 使用 KaTeX 渲染数学公式
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
```

### 3. SVG 图表渲染
```typescript
// 直接渲染 SVG 代码
const SVGRenderer = ({ svgCode }: { svgCode: string }) => {
  return <div dangerouslySetInnerHTML={{ __html: svgCode }} />;
};
```

### 4. 版本管理
```typescript
// 版本对比和管理
import { diffLines } from 'diff';
import { formatDistanceToNow } from 'date-fns';
```

## 📊 性能优化

### 1. 代码分割
- 按路由自动分割
- 组件懒加载
- 动态导入

### 2. 缓存策略
- Supabase 查询缓存
- 静态资源缓存
- API 响应缓存

### 3. 渲染优化
- 虚拟滚动
- 防抖输入
- 增量渲染

## 🔐 安全特性

### 1. 数据安全
- Row Level Security (RLS)
- SQL 注入防护
- XSS 攻击防护

### 2. 认证安全
- JWT Token 管理
- 密码强度验证
- 多因素认证支持

### 3. 权限控制
- 基于角色的访问控制
- 资源级权限管理
- API 访问限制

## 🚀 部署指南

### Vercel 部署
1. 连接 GitHub 仓库
2. 配置环境变量
3. 自动部署设置

### 环境变量配置
```env
# 生产环境
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🧪 测试策略

### 测试类型
- **单元测试**: Jest + Testing Library
- **集成测试**: API 端点测试
- **E2E 测试**: Playwright 自动化测试

### 测试命令
```bash
npm run test              # 运行所有测试
npm run test:unit         # 单元测试
npm run test:integration  # 集成测试
npm run test:e2e          # E2E 测试
npm run test:coverage     # 测试覆盖率
```

## 📈 路线图

### 🚧 当前开发中
- [x] 基础项目架构
- [x] 用户认证系统
- [ ] Markdown 编辑器
- [ ] LaTeX 公式渲染
- [ ] SVG 图表功能

### 🔮 未来计划
- [ ] 实时协作编辑
- [ ] 图片上传和管理
- [ ] 模板系统
- [ ] 引用管理
- [ ] 移动端应用
- [ ] 插件系统

## 🤝 贡献指南

### 贡献流程
1. Fork 项目
2. 创建功能分支
3. 提交代码
4. 创建 Pull Request

### 提交规范
```
feat: 新功能
fix: 修复问题
docs: 文档更新
style: 代码格式
refactor: 重构代码
test: 测试相关
chore: 构建工具
```

## 📄 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目的支持：
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [KaTeX](https://katex.org/)

---

⭐ 如果这个项目对你有帮助，请给它一个星标！