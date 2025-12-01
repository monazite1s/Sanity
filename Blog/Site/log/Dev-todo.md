
业务功能开发实施方案
基于 Arcadia 项目的架构理念,为用户认证、评论系统、标签筛选、站点留言板和 Footer 增强功能制定高质量实施方案。

用户需求回顾
需要实现以下功能:

IMPORTANT

核心要求

用户登录: 通过 GitHub/微信 OAuth 实现,不影响 SSG/SSR/ISR 性能
博客评论: 在博客详情页下方添加留言区,登录后可发布评论
标签页增强: 支持查看所有标签并进行筛选
站点留言板: 与博客、归档、日历同级的独立页面
Footer 增强: 显示站点运行时间、访问统计(使用 Vercel Analytics)
技术架构设计

1. 认证系统架构
技术选型: NextAuth.js v5 (Auth.js)

理由:

与 Next.js App Router 完美集成
支持多种 OAuth Provider (GitHub, WeChat 等)
Session 管理不影响 SSG/ISR 性能 (客户端 JWT)
符合项目"强抽象、弱耦合"理念
数据流:

用户点击登录 → OAuth Provider → NextAuth Callback → JWT Session → 客户端状态
2. 数据库设计
基于现有 Prisma Schema 扩展:

新增表结构
users 表 - 用户信息

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime? @map("email_verified")
  image         String?
  accounts      Account[]
  sessions      Session[]
  comments      Comment[]
  guestbookEntries GuestbookEntry[]
  
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  @@map("users")
}
accounts 表 - OAuth 账户关联

model Account {
  id                String  @id @default(cuid())
  userId            String  @map("user_id")
  type              String
  provider          String
  providerAccountId String  @map("provider_account_id")
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
  @@map("accounts")
}
sessions 表 - 会话管理

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique @map("session_token")
  userId       String   @map("user_id")
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@map("sessions")
}
comments 表 - 博客评论

model Comment {
  id        String   @id @default(cuid())
  postSlug  String   @map("post_slug")
  userId    String   @map("user_id")
  content   String   @db.Text
  parentId  String?  @map("parent_id")
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  parent    Comment? @relation("CommentReplies", fields: [parentId], references: [id])
  replies   Comment[] @relation("CommentReplies")
  
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  @@index([postSlug])
  @@index([userId])
  @@map("comments")
}
guestbook_entries 表 - 站点留言板

model GuestbookEntry {
  id        String   @id @default(cuid())
  userId    String   @map("user_id")
  content   String   @db.Text
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  @@index([userId])
  @@map("guestbook_entries")
}
3. Provider 层设计
遵循项目 Provider 模式,创建新的抽象层:

AuthProvider 接口
interface AuthProvider {
  getCurrentUser(): Promise<User | null>;
  signIn(provider: 'github' | 'wechat'): Promise<void>;
  signOut(): Promise<void>;
}
CommentProvider 接口
interface CommentProvider {
  getCommentsByPostSlug(slug: string): Promise<Comment[]>;
  createComment(data: CreateCommentInput): Promise<Comment>;
  deleteComment(id: string): Promise<void>;
}
GuestbookProvider 接口
interface GuestbookProvider {
  getEntries(): Promise<GuestbookEntry[]>;
  createEntry(content: string): Promise<GuestbookEntry>;
  deleteEntry(id: string): Promise<void>;
}
实施方案详解
Phase 1: 数据库与认证基础
1.1 Prisma Schema 扩展
[NEW]
schema.prisma
添加上述所有新模型,保持现有 CalendarEvent 模型不变。

1.2 NextAuth.js 配置
[NEW]
route.ts
配置 NextAuth.js,支持 GitHub OAuth (微信 OAuth 可选):

import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // 可选: 微信 OAuth
  ],
  session: {
    strategy: "jwt", // 使用 JWT,不影响 SSG/ISR
  },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
1.3 Auth Provider 实现
[NEW]
AuthProvider.ts
抽象认证接口。

[NEW]
NextAuthProvider.ts
NextAuth.js 实现。

[NEW]
index.ts
工厂函数,导出 getAuthProvider()。

Phase 2: 评论系统
2.1 Comment Provider 实现
[NEW]
CommentProvider.ts
评论接口定义。

[NEW]
PrismaCommentProvider.ts
Prisma 实现,包含嵌套回复逻辑。

[NEW]
index.ts
工厂函数。

2.2 评论 API 路由
[NEW]
route.ts
// GET /api/comments/[postSlug] - 获取评论
// POST /api/comments/[postSlug] - 创建评论 (需认证)
[NEW]
route.ts
// DELETE /api/comments/[id] - 删除评论 (需认证)
2.3 评论 UI 组件
[NEW]
CommentSection.tsx
评论区容器组件,包含:

登录提示 (未登录用户)
评论列表
评论输入框
[NEW]
CommentList.tsx
评论列表,支持嵌套回复。

[NEW]
CommentForm.tsx
评论输入表单。

2.4 集成到博客详情页
[MODIFY]
page.tsx
在文章内容下方添加 <CommentSection postSlug={slugStr} />。

Phase 3: 标签页增强
3.1 标签筛选 UI
[MODIFY]
page.tsx
添加:

搜索框 (客户端筛选)
排序选项 (按名称/文章数)
标签卡片点击跳转到 /tags/[tag]
保持 SSG 渲染策略不变。

Phase 4: 站点留言板
4.1 Guestbook Provider 实现
[NEW]
GuestbookProvider.ts
留言板接口。

[NEW]
PrismaGuestbookProvider.ts
Prisma 实现。

[NEW]
index.ts
工厂函数。

4.2 Guestbook API 路由
[NEW]
route.ts
// GET /api/guestbook - 获取留言
// POST /api/guestbook - 创建留言 (需认证)
[NEW]
route.ts
// DELETE /api/guestbook/[id] - 删除留言 (需认证)
4.3 Guestbook 页面
[NEW]
page.tsx
留言板页面,采用 CSR 渲染 (需要实时交互)。

[NEW]
GuestbookList.tsx
留言列表组件。

[NEW]
GuestbookForm.tsx
留言输入表单。

4.4 导航集成
[MODIFY]
GlobalHeader.tsx
在导航栏添加"留言板"链接。

Phase 5: Footer 增强
5.1 站点统计服务
[NEW]
SiteStatsProvider.ts
站点统计接口:

interface SiteStatsProvider {
  getVisitorCount(): Promise<number>;
  getSiteUptime(): number; // 计算站点运行天数
}
[NEW]
VercelStatsProvider.ts
使用 Vercel Analytics API 获取访问数据。

WARNING

Vercel Analytics API 需要 Pro 计划,免费版可能无法访问详细数据。

备选方案: 使用 Vercel Web Analytics (免费) 的客户端 SDK,或自建简单计数器。

5.2 Footer 组件更新
[MODIFY]
GlobalFooter.tsx
添加:

站点运行时间 (从固定日期计算)
访问统计 (从 Vercel Analytics 或自建 API)
使用客户端组件 ("use client") 实现动态更新
性能优化策略
SSG/SSR/ISR 兼容性
功能 渲染策略 说明
用户认证 CSR 使用 JWT Session,客户端检查登录状态,不影响 SSG
评论列表 SSR 服务端渲染初始评论,客户端 Hydration 后支持交互
评论提交 CSR 客户端提交,乐观更新 UI
标签页 SSG 保持静态生成,筛选功能在客户端实现
留言板 CSR 完全客户端渲染,实时交互
Footer 统计 CSR 客户端动态加载,不阻塞页面渲染
缓存策略
评论数据: ISR revalidate 60s
留言板: 客户端 SWR,缓存 30s
站点统计: 客户端缓存 5 分钟
验证计划
自动化测试
NOTE

当前项目未配置测试框架,建议后续添加 Vitest + React Testing Library。

手动验证步骤

1. 认证系统验证
前置条件:

在 GitHub 创建 OAuth App,获取 GITHUB_ID 和 GITHUB_SECRET
配置
.env.local
:
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
NEXTAUTH_URL=<http://localhost:3000>
NEXTAUTH_SECRET=your_random_secret
验证步骤:

运行 yarn dev
访问任意需要登录的页面 (如博客详情页评论区)
点击"登录"按钮
验证 GitHub OAuth 流程:
跳转到 GitHub 授权页
授权后跳转回原页面
显示用户头像和用户名
点击"登出"按钮,验证登出功能
2. 评论系统验证
验证步骤:

登录后访问任意博客文章详情页
在评论区输入内容,点击"发表评论"
验证评论立即显示在列表中
刷新页面,验证评论持久化
点击"回复"按钮,验证嵌套回复功能
点击"删除"按钮 (仅自己的评论),验证删除功能
3. 标签筛选验证
验证步骤:

访问 /tags 页面
在搜索框输入标签名称,验证实时筛选
切换排序方式 (按名称/文章数),验证排序功能
点击标签卡片,验证跳转到 /tags/[tag] 页面
4. 留言板验证
验证步骤:

访问 /guestbook 页面
未登录时,验证显示"请登录后留言"提示
登录后,在输入框输入留言,点击"发表"
验证留言立即显示在列表顶部
刷新页面,验证留言持久化
点击"删除"按钮 (仅自己的留言),验证删除功能
5. Footer 统计验证
验证步骤:

访问任意页面,滚动到 Footer
验证显示"站点运行 X 天"
验证显示"访问量: X 次" (如果 Vercel Analytics 可用)
等待 5 秒,验证数据不会频繁刷新 (缓存生效)
6. 性能验证
验证步骤:

运行 yarn build
检查构建输出,验证:
/blog 页面仍为 ISR
/blog/[...slug] 页面仍为 SSG
/tags 页面仍为 SSG
/guestbook 页面为 CSR
运行 yarn start,使用 Lighthouse 测试首页性能
验证 Performance Score ≥ 90
风险与注意事项
CAUTION

数据库迁移风险

添加新表时,需要执行 Prisma 迁移:

npx prisma migrate dev --name add_auth_and_comments
确保在生产环境部署前,先在开发环境充分测试迁移脚本。

WARNING

Vercel Analytics 限制

免费版 Vercel Analytics 不提供 API 访问,仅提供 Dashboard 查看。

建议:

使用 Vercel Web Analytics SDK (客户端埋点,免费)
或自建简单计数器 (存储在数据库)
IMPORTANT

OAuth 回调 URL 配置

GitHub OAuth App 的回调 URL 必须设置为:

开发环境: <http://localhost:3000/api/auth/callback/github>
生产环境: <https://yourdomain.com/api/auth/callback/github>
实施时间估算
阶段 预计时间
Phase 1: 认证基础 2-3 天
Phase 2: 评论系统 3-4 天
Phase 3: 标签增强 1 天
Phase 4: 留言板 2 天
Phase 5: Footer 增强 1 天
测试与优化 2 天
总计 11-13 天
后续扩展建议
 添加评论点赞功能
 实现评论举报/审核机制
 支持 Markdown 格式评论
 添加邮件通知 (新评论/回复)
 集成全文搜索 (Algolia / Meilisearch)
 添加文章浏览量统计
 实现用户个人主页
