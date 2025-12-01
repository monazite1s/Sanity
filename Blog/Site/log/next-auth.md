# 博客实现Auth认证

### 第一步: 安装依赖

```
yarn add next-auth@beta @auth/prisma-adapter
```

next-auth@beta是 NextAuth.js v5 (也叫 Auth.js),支持 App Router

@auth/prisma-adapter是 Prisma 适配器,自动处理用户/会话数据存储

### 第二步: 运行数据库迁移

```bash
npx prisma migrate dev --name add_auth_and_comments
```

*根据* *schema.prisma* *生成 SQL 迁移文件*

### 第三步: 配置环境变量

在 `.env.local` 添加配置

```bash
# NextAuth.js 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=你的随机密钥(可以用 openssl rand -base64 32 生成)

# GitHub OAuth (需要在 GitHub 创建 OAuth App)
GITHUB_ID=你的_github_client_id
GITHUB_SECRET=你的_github_client_secret
```

 访问 https://github.com/settings/developers

1. 点击 "New OAuth App"

2. 填写:

   - Application name: Arcadia Blog (随便起)

   - Homepage URL:

     ```
     http://localhost:3000
     ```

   - Authorization callback URL:

     ```
     http://localhost:3000/api/auth/callback/github
     ```

3. 创建后复制 Client ID 和 Client Secret





# 为什么用JWT？

### JWT vs Database Session

| 特性     | JWT                 | Database              |
| :------- | :------------------ | :-------------------- |
| 性能     | ⚡ 快 (无数据库查询) | 🐢 慢 (每次查询数据库) |
| 安全性   | ⚠️ 无法主动撤销      | ✅ 可以主动撤销        |
| 适用场景 | SSG/ISR 博客        | 需要实时控制的应用    |

我们选择 JWT 是因为:

- 不影响 SSG/ISR 性能
- 博客场景不需要频繁撤销 session
- 减少数据库负载





### 乐观更新 vs 重新加载

当前实现使用**重新加载**策略:

- 发表评论后,重新 fetch 所有评论
- 简单可靠,但性能略差

**优化方向**(可选):

- 使用 SWR 或 React Query 缓存
- 乐观更新: 先更新 UI,再发送请求



## 📊 XSS 防护层级

| 层级        | 防护措施          | 状态       | 重要性 |
| :---------- | :---------------- | :--------- | :----- |
| 1. 前端显示 | React 自动转义    | ✅ 已有     | ⭐⭐⭐⭐⭐  |
| 2. 输入验证 | 长度/格式检查     | ⚠️ 建议添加 | ⭐⭐⭐⭐   |
| 3. 内容清理 | 移除控制字符      | ⚠️ 建议添加 | ⭐⭐⭐    |
| 4. CSP 头   | 限制脚本来源      | ⚠️ 可选     | ⭐⭐     |
| 5. 数据库   | Prisma 参数化查询 | ✅ 已有     | ⭐⭐⭐⭐   |

1. **立即添加**: 输入验证(长度限制、非空检查)
2. **建议添加**: 前端字符计数和错误提示
3. **可选**: CSP 头(如果需要更高安全性)