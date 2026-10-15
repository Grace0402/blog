# My Blog

一个基于 **Next.js 14（App Router）** 的开源个人博客模板。极简卡片风 + 暖米色调，内置樱花飘落、桌面宠物、弹幕等氛围特效，**零数据库依赖**——所有数据存在单个 `data.json` 文件里，克隆下来 `npm install` 即可运行。

> 无需 MySQL / Redis，备份数据只需复制一个文件，适合个人小站快速搭建。

## ✨ 功能特性

### 前台

- **文章**：Markdown 渲染、GFM 表格、代码高亮、标签、归档时间线、搜索、分页
- **互动**：评论 + 点赞、友链、留言墙（便利贴）
- **展示**：开源项目列表、音乐播放器
- **个性化**：暗色模式、中英双语、站点统计、天气 / 时钟 / 日历组件
- **氛围特效**：樱花飘落、竹子、弹幕、光晕、点击粒子、桌面宠物（猫 / 猫娘）

### 后台（`/admin`）

- JWT 登录鉴权
- 文章增删改查（富文本编辑器）
- 图片 / 音频上传
- 友链、留言墙、项目、音乐、关于我管理
- Markdown 导入 / 导出（导出带 YAML front matter，适配 CSDN）

## 🛠 技术栈

| 层 | 选型 |
|---|---|
| 框架 | Next.js 14（App Router） |
| UI | React 18 + Tailwind CSS 3 |
| Markdown | react-markdown + remark-gfm + rehype-highlight + highlight.js |
| 认证 | jsonwebtoken + bcryptjs |
| 上传 | multer |
| 部署脚本 | ssh2 |
| 数据存储 | `data.json` 单文件（`lib/db.js` 封装，无数据库） |

## 🚀 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 准备数据文件（复制示例，得到空数据）
cp data.json.example data.json

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，至少填一个 JWT_SECRET

# 4. 启动开发服务器
npm run dev
```

浏览器打开 http://localhost:3000

## 🔐 后台登录

- 后台地址：`/admin/login`，用户名 `admin`
- 首次启动会自动创建管理员账号，初始密码的确定顺序：
  1. 若设置了环境变量 `ADMIN_INIT_PASSWORD`，则用它作为初始密码；
  2. 否则随机生成一串 6 位密码，并打印在**终端控制台**（形如 `Admin user created: admin / xxxxxx`）。
- 生产环境务必：设置 `JWT_SECRET`、登录后修改默认密码。

## 🔑 环境变量

| 变量 | 用途 | 必填 |
|---|---|---|
| `JWT_SECRET` | 后台登录 token 签名密钥 | 生产必填 |
| `ADMIN_INIT_PASSWORD` | 首次初始化管理员账号的初始密码 | 可选 |
| `DEPLOY_HOST` | 部署目标服务器 IP / 域名 | 部署时 |
| `DEPLOY_USER` | SSH 用户名 | 部署时 |
| `DEPLOY_PASSWORD` | SSH 密码 | 部署时 |

## 📁 数据存储

所有内容（文章、标签、评论、友链、项目、音乐、站点设置）都在根目录的 `data.json` 里，由 `lib/db.js` 读写。备份只需复制这一个文件。

## 🔌 API 接口

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/auth/login` | 后台登录 |
| GET/POST | `/api/posts` | 文章列表 / 新建 |
| GET/PUT/DELETE | `/api/posts/[id]` | 文章详情 / 更新 / 删除 |
| GET/POST | `/api/tags` | 标签 |
| GET/POST | `/api/comments` | 评论 |
| POST | `/api/comments/like` | 点赞 |
| GET/POST | `/api/friends` | 友链 |
| GET/POST | `/api/chatter` | 留言墙 |
| GET/POST | `/api/projects` | 项目 |
| GET/POST | `/api/music` | 音乐 |
| GET/PUT | `/api/site-settings` | 站点设置 |
| GET | `/api/site-stats` | 站点统计 |
| POST | `/api/upload` | 文件上传 |
| GET | `/api/uploads/[filename]` | 读取上传文件 |
| GET | `/api/export` | 导出 Markdown |
| POST | `/api/import` | 导入 Markdown |

## 🖼 自定义

- **站点名称 / 头像 / 介绍 / 社交链接**：后台「关于我」页面，或直接编辑 `data.json` 的 `settings`
- **桌面宠物图片**：`images/` 目录（猫 / 猫娘两套）
- **主题色**：`tailwind.config.js` 中的 `warm` / `amber` 色板
- **文案**：`locales/zh.json` 与 `locales/en.json`

## 📂 目录结构

```
app/            # 前台页面 + 后台管理 + API 路由
  page.js       # 首页（搜索 / 侧栏 / 文章流）
  posts/[slug]/ # 文章详情
  about/  projects/  tags/  timeline/  friends/  chatter/   # 前台页面
  admin/        # login / dashboard / editor / projects / friends / chatter / music / about / upload
  api/          # 16 个接口（见上表）
components/     # 20 个组件（PostCard、DesktopPet、WeatherWidget、SakuraPetals 等）
contexts/       # Theme / Music / Effect 全局状态
lib/            # db.js（数据层）、auth.js（认证）
locales/        # 中英文案（zh.json / en.json）
public/uploads/ # 上传的图片 / 音频（运行时生成）
data.json       # 数据文件（由 data.json.example 复制而来）
deploy.js       # 基于 ssh2 的部署脚本
blog-nginx.conf # Nginx 配置参考
```

## ☁️ 部署

```bash
# 构建
npm run build

# 启动
npm start
```

- Nginx 反向代理配置参考 `blog-nginx.conf`（记得把域名 `example.com` 换成你自己的）
- `deploy.js` / `update-server.js` 提供基于 ssh2 的自动部署，需先设置 `DEPLOY_HOST` / `DEPLOY_USER` / `DEPLOY_PASSWORD`

## 📄 License

MIT
