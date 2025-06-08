# 部署指南

本文档介绍如何将 Academic Paper Renderer 部署到 Vercel。

## 前置条件

1. **GitHub 账户**: 用于代码托管
2. **Vercel 账户**: 用于部署应用
3. **Supabase 项目**: 用于数据库和认证

## 步骤 1: 准备代码仓库

### 1.1 初始化 Git 仓库

```bash
git init
git add .
git commit -m "Initial commit: Academic Paper Renderer"
```

### 1.2 创建 GitHub 仓库

1. 登录 GitHub
2. 创建新仓库 `academic-paper-renderer`
3. 推送代码到 GitHub:

```bash
git remote add origin https://github.com/YOUR_USERNAME/academic-paper-renderer.git
git branch -M main
git push -u origin main
```

## 步骤 2: 配置 Supabase

### 2.1 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com)
2. 创建新项目
3. 记录以下信息:
   - Project URL
   - Anon Key
   - Service Role Key

### 2.2 运行数据库迁移

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录 Supabase
supabase login

# 链接到你的项目
supabase link --project-ref YOUR_PROJECT_REF

# 推送数据库 schema
supabase db push
```

### 2.3 配置认证

在 Supabase 仪表板中:

1. 前往 Authentication > Settings
2. 添加站点 URL: `https://your-app.vercel.app`
3. 配置重定向 URL: `https://your-app.vercel.app/auth/callback`

## 步骤 3: 部署到 Vercel

### 3.1 连接 GitHub 仓库

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 导入你的 GitHub 仓库
4. 选择 "Next.js" 框架

### 3.2 配置环境变量

在 Vercel 项目设置中添加以下环境变量:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 3.3 部署配置

Vercel 会自动检测 `vercel.json` 配置文件并应用设置。

### 3.4 触发部署

点击 "Deploy" 按钮开始部署。

## 步骤 4: 验证部署

### 4.1 检查应用状态

1. 访问部署的 URL
2. 测试用户注册和登录
3. 创建测试论文
4. 验证所有功能正常工作

### 4.2 监控部署

在 Vercel 仪表板中:

1. 查看部署日志
2. 监控性能指标
3. 检查错误报告

## 步骤 5: 域名配置 (可选)

### 5.1 添加自定义域名

1. 在 Vercel 项目设置中
2. 前往 "Domains"
3. 添加你的域名
4. 配置 DNS 记录

### 5.2 更新认证设置

在 Supabase 中更新站点 URL 为你的自定义域名。

## 环境变量说明

| 变量名 | 描述 | 示例 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | https://xxx.supabase.co |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 服务角色密钥 | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... |
| `NEXT_PUBLIC_APP_URL` | 应用的公开 URL | https://your-app.vercel.app |

## 故障排除

### 常见问题

1. **构建失败**
   - 检查 TypeScript 类型错误
   - 确认所有依赖已正确安装

2. **认证问题**
   - 验证 Supabase 环境变量
   - 检查站点 URL 配置

3. **数据库连接问题**
   - 确认数据库迁移已运行
   - 检查 RLS 策略配置

### 调试步骤

1. 查看 Vercel 构建日志
2. 检查浏览器控制台错误
3. 查看 Supabase 仪表板日志

## 持续部署

配置完成后，每次推送到 `main` 分支都会自动触发部署。

### 预览部署

对于 Pull Request，Vercel 会自动创建预览部署，方便测试新功能。

## 性能优化

### 1. 图片优化

使用 Next.js Image 组件进行自动图片优化。

### 2. 缓存策略

配置适当的缓存头部信息。

### 3. Bundle 分析

```bash
npm run build
npm run analyze
```

## 监控和分析

### 1. Vercel Analytics

启用 Vercel Analytics 监控应用性能。

### 2. 错误追踪

集成 Sentry 或其他错误追踪服务。

### 3. 用户分析

添加 Google Analytics 或其他分析工具。

## 备份和恢复

### 数据库备份

定期备份 Supabase 数据库:

```bash
supabase db dump > backup.sql
```

### 代码备份

确保代码定期推送到 GitHub。

## 安全考虑

1. 定期更新依赖
2. 监控安全漏洞
3. 配置适当的 CORS 策略
4. 启用 HTTPS
5. 设置适当的 CSP 头部

## 扩展建议

1. 配置 CDN 加速
2. 添加多区域部署
3. 实现负载均衡
4. 配置数据库读写分离

---

如果遇到问题，请查看：

- [Vercel 文档](https://vercel.com/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)