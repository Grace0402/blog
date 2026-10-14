# My Blog

一个基于 **Next.js 14** 的开源个人博客模板。极简卡片风 + 暖米色调，内置樱花飘落、桌面宠物等氛围特效，零数据库依赖，克隆下来 `npm install` 即可运行。

> 数据存储在单个 `data.json` 文件里，无需 MySQL / Redis，适合个人小站快速搭建。

## ✨ 功能特性

- **文章**：Markdown 渲染、GFM 表格、代码高亮、标签、归档时间线、搜索、分页
- **互动**：评论 + 点赞、友链、留言墙（便利贴）
- **展示**：开源项目列表、音乐播放器
- **后台管理**：JWT 登录、富文本编辑器、图片/音频上传、Markdown 导入导出（适配 CSDN）
- **个性化**：暗色模式、中英双语、站点统计、天气 / 时钟 / 日历组件
- **氛围特效**：樱花飘落、竹子、弹幕、光晕、点击粒子、桌面宠物

## 🛠 技术栈

| 层 | 选型 |
|---|---|
| 框架 | Next.js 14（App Router） |
| UI | React 18 + Tailwind CSS 3 |
| Markdown | react-markdown + remark-gfm + rehype-highlight |
| 认证 | jsonwebtoken + bcryptjs |
| 数据存储 | `data.json` 单文件（`lib/db.js` 封装） |

## 🚀 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 准备数据文件
cp data.json.example data.json

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，至少填一个 JWT_SECRET

# 4. 启动开发服务器
npm run dev
```

浏览器打开 http://localhost:3000

## 🔐 后台登录

- 后台地址：`/admin/login`
- 首次启动会在 `data.json` 里自动创建管理员账号 `admin`，初始密码会打印在终端控制台（也可通过环境变量 `ADMIN_INIT_PASSWORD` 预先指定）
- 生产环境务必设置 `JWT_SECRET` 并修改默认密码

## 📁 数据存储

所有内容（文章、标签、评论、友链、项目、音乐、站点设置）都在根目录的 `data.json` 里，用 `lib/db.js` 读写。备份只需复制这一个文件。

## 🖼 自定义

- **站点名称 / 头像 / 介绍 / 社交链接**：后台「关于我」页面，或直接编辑 `data.json` 的 `settings`
- **桌面宠物图片**：`images/` 目录（猫 / 猫娘两套）
- **主题色**：`tailwind.config.js` 中的 `warm` / `amber` 色板
- **文案**：`locales/zh.json` 与 `locales/en.json`

## ☁️ 部署

- Nginx 配置参考 `blog-nginx.conf`（记得把域名 `example.com` 换成你自己的）
- `deploy.js` / `update-server.js` 提供基于 ssh2 的自动部署，需设置环境变量 `DEPLOY_HOST` / `DEPLOY_USER` / `DEPLOY_PASSWORD`

## 📂 目录结构

```
app/            # 前台页面 + 后台管理 + API 路由
components/     # 组件（PostCard、DesktopPet、WeatherWidget 等）
contexts/       # Theme / Music / Effect 全局状态
lib/            # db.js（数据层）、auth.js（认证）
locales/        # 中英文案
public/uploads/ # 上传的图片 / 音频（运行时生成）
data.json       # 数据文件（由 data.json.example 复制而来）
```

## 📄 License

MIT
