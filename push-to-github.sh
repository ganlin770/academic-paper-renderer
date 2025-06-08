#!/bin/bash

# GitHub推送脚本
# 请将YOUR_USERNAME替换为您的GitHub用户名

USERNAME="YOUR_USERNAME"
REPO_URL="https://github.com/$USERNAME/academic-paper-renderer.git"

echo "🚀 准备推送到GitHub..."
echo "📝 请确保您已经创建了GitHub仓库: academic-paper-renderer"
echo ""

# 添加远程仓库
echo "🔗 添加远程仓库..."
git remote add origin $REPO_URL

# 推送到GitHub
echo "📤 推送代码到GitHub..."
git push -u origin main

echo ""
echo "✅ 推送完成！"
echo "🌐 仓库地址: $REPO_URL"
echo ""
echo "🔧 下一步:"
echo "1. 访问仓库页面设置描述和标签"
echo "2. 配置GitHub Pages（如果需要）"
echo "3. 设置分支保护规则"
echo "4. 邀请协作者"