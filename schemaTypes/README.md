# Sanity Schema 配置说明

## Post Schema

博客文章的 Schema 定义，支持 MDX 格式内容。

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | ✅ | 文章标题 |
| `slug` | slug | ✅ | URL slug（自动从 title 生成） |
| `publishedAt` | datetime | ✅ | 发布日期 |
| `excerpt` | text | ❌ | 文章摘要（用于列表页和 SEO） |
| `tags` | array[string] | ❌ | 标签数组 |
| `series` | string | ❌ | 系列文章名称 |
| `body` | text | ✅ | MDX 格式的文章内容 |
| `image` | image | ❌ | 封面图片（支持 alt 文本） |

### 使用说明

1. **创建文章**：在 Sanity Studio 中点击 "Create" → "Blog Post"
2. **编写内容**：在 `body` 字段中使用 MDX 语法编写文章
3. **添加标签**：在 `tags` 字段中输入标签，按回车添加
4. **设置系列**：如果文章属于某个系列，在 `series` 字段中输入系列名称

### MDX 示例

```mdx
# 这是一个标题

这是一段文字。

## 代码示例

\`\`\`javascript
const hello = "world";
\`\`\`

## 使用自定义组件

<Callout type="info">
这是一个提示框
</Callout>
```

### 预览配置

在 Sanity Studio 列表中会显示：

- 标题
- 发布日期
- 前 3 个标签
- 封面图片（如果有）
