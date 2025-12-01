# 文档同步脚本说明

## 概述

`importDocs.ts` 脚本用于将本地 `docs-source/` 目录中的 Markdown 文档同步到 Sanity CMS。

## 使用步骤

### 1. 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp .env.example .env
```

在 `.env` 中设置：

- `SANITY_STUDIO_PROJECT_ID`: 项目 ID（在 sanity.cli.ts 中可以找到）
- `SANITY_STUDIO_DATASET`: 数据集名称（通常为 production）
- `SANITY_API_TOKEN`: API Token（需要 Editor 或 Administrator 权限）

获取 API Token：

1. 访问 <https://sanity.io/manage>
2. 选择你的项目
3. 进入 API → Tokens
4. 点击 "Add API token"，权限选择 Editor 或 Administrator

### 2. 安装依赖

```bash
yarn install
```

### 3. 准备文档文件

在 `docs-source/` 目录中按以下结构组织文档：

```
docs-source/
├── react-basics/           # 一级分类
│   ├── _meta.json         # 分类元数据（可选）
│   ├── hooks/             # 二级分类
│   │   ├── _meta.json
│   │   ├── useState.md
│   │   └── useEffect.md
│   └── components.md
└── typescript/
    ├── _meta.json
    └── basics.md
```

参考 `docs-source/README.md` 了解详细的目录结构规范。

### 4. 生成导入文件

```bash
yarn import:generate
```

这将扫描 `docs-source/` 目录，生成 `docs-import.ndjson` 文件。

### 5. 上传到 Sanity

```bash
yarn import:upload
```

或使用一步执行：

```bash
yarn import:generate && yarn import:upload
```

## 文件格式

### 分类元数据 `_meta.json`

```json
{
  "title": "React 基础",
  "slug": "react-basics",
  "order": 1
}
```

### 文档 Frontmatter

```markdown
---
title: useState 使用指南
slug: use-state
order: 1
---

# useState 使用指南

文档内容...
```

## 注意事项

1. **环境变量必须设置**：脚本会检查环境变量，未设置会报错
2. **文档必须在分类下**：根目录的 `.md` 文件会被跳过
3. **ID 生成规则**：分类 ID 为 `cat-{slug}`，文档 ID 为 `page-{slug}`
4. **支持无限嵌套**：分类可以有任意层级的子分类
5. **自动排序**：未指定 order 时按文件名字母数字顺序排序

## 故障排除

### 环境变量未设置

**错误**：`❌ SANITY_API_TOKEN 环境变量未设置或无效`

**解决**：检查 `.env` 文件是否存在，API Token 是否正确

### 目录不存在

**错误**：`❌ 目录不存在: docs-source`

**解决**：创建 `docs-source/` 目录并添加文档

### 导入失败

**错误**：`sanity dataset import` 命令失败

**解决**：

1. 检查 Sanity CLI 是否已登录：`sanity login`
2. 检查数据集名称是否正确
3. 检查 NDJSON 文件格式是否正确
