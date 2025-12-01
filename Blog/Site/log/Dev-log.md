# Next Blog 开发日志

## 1. 项目选型

### 1.1 基础架构：现代无头 CMS 架构 (Headless CMS)

本项目采用**Jamstack/无头 CMS 架构**，实现了前端、内容和数据层的完全解耦，以追求卓越的性能、开发效率和可扩展性。

| 架构层 | 核心技术 | 职责描述 | 优势 |
| :--- | :--- | :--- | :--- |
| **前端/应用层** | **Next.js (React)** | 负责路由、组件渲染、静态生成 (SSG) 和服务器端渲染 (SSR)。 | 性能卓越，利用 Vercel 托管实现 Serverless 部署和 CDN 加速。 |
| **内容层 (CMS)** | **Sanity** | **无头 CMS**，用于集中存储博客文章、作者、标签等核心内容数据。 | 实时编辑和内容预览，使用高效的 **GROQ/GraphQL** 查询接口。 |
| **数据层 (DB)** | **Prisma + PostgreSQL/MySQL** | 用于存储非内容数据，如用户认证会话、订阅、日历事件等应用业务数据。 | 数据持久化，与内容数据分离，保持架构简洁。 |
| **数据交付** | **Vercel CDN + 规划中的国内 CDN** | 全球内容分发与缓存，确保内容的高速交付。 | 提升加载速度，减少源站负载。 |

### 1.2 项目技术栈详细表

技术栈的选择遵循高性能、类型安全和工程化标准。

| 类别 | 技术栈名称 | 包名/工具 | 作用描述 |
| :--- | :--- | :--- | :--- |
| **核心框架与构建** | 前端框架 | `next`, `react`, `react-dom` | Next.js App Router (v16) 构建，核心 React UI 库。 |
| | TypeScript | `typescript` | 强类型语言，增强代码健壮性和可维护性。 |
| **内容与数据管理** | 内容管理系统 | `@sanity/client`, `next-sanity` | 客户端连接 Sanity API，获取内容数据。 |
| | Markdown/MDX | `next-mdx-remote`, `remark-gfm` | MDX 渲染能力，支持在 Markdown 中嵌入 React 组件。 |
| | 代码高亮 | `rehype-pretty-code`, `shiki` | 代码块语法高亮，基于 Shiki 实现高质量的渲染。 |
| | 数据库 ORM | `prisma`, `@prisma/client` | 数据库操作层，用于应用数据的 CRUD 任务。 |
| **认证与状态管理** | 认证系统 | `next-auth`, `@auth/prisma-adapter` | 提供了 OAuth 认证流程（如 GitHub Auth），使用 Prisma 持久化会话。 |
| | 客户端状态 | `zustand` | 轻量级状态管理库，用于管理主题模式等全局状态。 |
| **样式与 UI** | 样式框架 | `tailwindcss`, `@tailwindcss/postcss` | 原子化 CSS 框架，负责所有的布局和样式。 |
| | 动画效果 | `tailwindcss-animate` | 扩展 Tailwind，提供组件和页面的过渡动画（如 `animate-in`）。 |
| | UI 辅助 | `clsx`, `tailwind-merge` | CSS 类名组合和冲突解决工具，提高 Tailwind 的复用性。 |
| | 图标库 | `lucide-react` | 简洁、现代的 React 图标组件库。 |
| **工程化与质量** | 代码规范 | `eslint`, `prettier` | 统一代码风格和潜在 Bug 检测。 |
| | Git 规范 | `husky`, `commitizen`, `cz-conventional-changelog` | 强制执行 Conventional Commits 规范，确保提交信息结构化。 |
| | 依赖管理 | `knip` | 检查项目中未使用的依赖、文件和导出，减少冗余代码。 |
| **辅助工具** | 性能监控 | `@vercel/speed-insights` | 自动收集 RUM (真实用户监控) 数据。 |
| | 日期处理 | `date-fns` | 轻量级日期格式化和操作库。 |

### 1.3 认证、性能监控、部署策略

| 模块 | 技术实现 | 详情描述 |
| :--- | :--- | :--- |
| **用户认证** | **NextAuth.js (GitHub)** | 使用 NextAuth.js 框架，选择 **GitHub Auth Provider** 作为社交登录方式。通过 `@auth/prisma-adapter` 将用户会话信息存储在 PostgreSQL 数据库中。 |
| **性能监控** | **Vercel Speed Insights** | 在 `RootLayout` 中集成 `<SpeedInsights />` 组件，无需额外配置，自动收集 LCP, CLS, INP 等核心网络指标 (Core Web Vitals)。 |
| **部署托管** | **Vercel Platform** | 基于 Vercel 的 Git 集成实现自动化部署。Vercel 负责将 Next.js 编译为 Serverless Functions 和静态资源，并进行全球 CDN 分发。 |

---

## 2. 项目开发：核心模块与业务逻辑

本部分聚焦于实现博客的核心功能及其依赖。

| 模块名称 | 核心业务逻辑 | 主要功能实现 | 关键技术依赖 |
| :--- | :--- | :--- | :--- |
| **内容渲染** | **MDX 管道** | 支持从 Sanity 获取的 Markdown/MDX 内容进行解析和渲染，允许在文章中使用 React 组件。 | `next-mdx-remote`, `remark-gfm` |
| **文章详情** | **代码高亮** | 为文章中的代码块提供主题化、准确的语法高亮能力。 | `rehype-pretty-code`, `shiki` |
| **页面骨架** | **主题切换** | 实现亮暗模式切换功能，利用 `zustand` 和 `ThemeProvider` 进行状态管理，解决了 FOUC (无样式内容闪烁) 问题。 | `zustand`, CSS Variables, `script` injection |
| **UI 基础** | **组件变体** | 定义可复用的 UI 组件（如 Button, Card），使用 CVA (Class Variance Authority) 管理不同状态的样式变体。 | `class-variance-authority`, `tailwind-merge` |
| **后台交互** | **数据持久化** | 确保用户会话、应用配置等业务数据可靠地存储在关系型数据库中。 | `Prisma` |
| **用户体验** | **页面过渡** | 在页面切换时，提供平滑的淡入、上滑动画，增强应用的用户体验感。 | `tailwindcss-animate` |

---

## 3. 项目优化

| 优化目标 | 实施措施 | 解决效果与现状 |
| :--- | :--- | :--- |
| **数据库稳定性** | **Prisma 单例模式** | 在 Serverless/Vercel 环境中，确保 Prisma Client 实例为单例，防止在函数调用激增时耗尽数据库连接池。 |
| **Vercel 域名绑定** | **修复 WWW 绑定** | 解决 `www` 子域名 404 错误。在 Vercel Domains 配置中，明确添加 `www.scm-arcadia-blog.xyz`，并设置正确的 CNAME/A 记录。 |
| **开发效率** | **工程化工具** | 通过 `husky` 和 `commitizen` 强制执行 Git 提交规范，通过 `knip` 定期清理死代码和冗余依赖。 |
