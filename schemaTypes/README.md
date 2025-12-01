# Sanity Schema 配置说明

本目录包含所有 Sanity CMS 的 Schema 定义，用于数据建模和内容管理。

## Schema 列表

### 1. Post Schema (`postType.ts`)

博客文章的 Schema 定义，用于博客随笔内容管理。

#### 字段说明

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

#### 使用说明

1. **创建文章**：在 Sanity Studio 中点击 "Create" → "Blog Post"
2. **编写内容**：在 `body` 字段中使用 MDX 语法编写文章
3. **添加标签**：在 `tags` 字段中输入标签，按回车添加
4. **设置系列**：如果文章属于某个系列，在 `series` 字段中输入系列名称

#### MDX 示例

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

---

### 2. Doc Category Schema (`docCategoryType.ts`)

知识库分类目录 Schema，支持多级嵌套，用于构建类似 VuePress 的侧边栏导航。

#### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | ✅ | 分类名称（如：React 基础） |
| `slug` | slug | ✅ | URL 路径（自动从 title 生成） |
| `order` | number | ✅ | 排序序号（数字越小越靠前） |
| `parentCategory` | reference | ❌ | 父级分类（留空为顶级分类） |

#### 特性

- **无限嵌套**：通过 `parentCategory` 自引用实现多级分类
- **灵活排序**：使用 `order` 字段控制显示顺序
- **预览优化**：在 Studio 中显示父级关系和序号

#### 使用示例

创建顶级分类：

- `title`: "React"
- `order`: 1
- `parentCategory`: 留空

创建子分类：

- `title`: "Hooks"
- `order`: 1
- `parentCategory`: 选择 "React"

---

### 3. Doc Page Schema (`docPageType.ts`)

知识库文档页面 Schema，用于存储前端系统性知识总结的具体文档内容。

#### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | ✅ | 文档标题（如：useState 使用指南） |
| `slug` | slug | ✅ | URL 路径（自动从 title 生成） |
| `content` | text | ✅ | MDX 格式的文档内容 |
| `category` | reference | ✅ | 所属分类（引用 docCategory） |
| `order` | number | ✅ | 在所属分类下的排序序号 |

#### 使用说明

1. **创建文档**：在 Sanity Studio 中点击 "Create" → "知识库文档"
2. **选择分类**：在 `category` 字段中选择所属分类
3. **编写内容**：在 `content` 字段中使用 MDX 语法编写文档
4. **设置顺序**：使用 `order` 字段控制在分类下的显示顺序

#### MDX 内容示例

```mdx
# useState Hook 详解

## 基本用法

\`\`\`jsx
const [count, setCount] = useState(0);
\`\`\`

## 注意事项

- 状态更新是异步的
- 使用函数式更新避免闭包陷阱
```

---

### 4. About Schema (`aboutType.ts`)

关于页面的 Schema 定义。

---

## 内容组织策略

### Blog 目录（博客随笔）

- **位置**：`Blog/` 目录
- **Schema**：`post`
- **特点**：按时间维度组织，不定期更新
- **同步**：需要单独的同步脚本（待实现）

### Docs 目录（知识库）

- **位置**：`docs-source/` 目录
- **Schema**：`docCategory` + `docPage`
- **特点**：按主题维度组织，系统性知识
- **同步**：使用 `scripts/importDocs.ts` 脚本

参考 [`docs-source/README.md`](../docs-source/README.md) 了解详细的目录结构规范。

---

## 数据同步

### 知识库文档同步

```bash
# 1. 配置环境变量（首次使用）
cp .env.example .env

# 2. 生成导入文件
yarn import:generate

# 3. 上传到 Sanity
yarn import:upload
```

详细说明请参考 [`scripts/README.md`](../scripts/README.md)

---

## 预览配置

在 Sanity Studio 列表中的显示效果：

### Post 预览

- 标题
- 发布日期
- 前 3 个标签
- 封面图片（如果有）

### Doc Category 预览

- 分类名称
- 父级分类（如果有）
- 排序序号

### Doc Page 预览

- 文档标题
- 所属分类
- 排序序号
