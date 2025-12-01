import { defineField, defineType } from 'sanity'

/**
 * 知识库文档页面 Schema
 * 用于存储前端系统性知识总结的具体文档内容
 */
export const docPageType = defineType({
    name: 'docPage',
    title: '知识库文档',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: '文档标题',
            type: 'string',
            description: '例如：useState 使用指南、Vue 3 响应式原理',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'URL 路径',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            description: '自动从标题生成，用于构建文档 URL',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'content',
            title: '文档内容',
            type: 'text', // 使用 text 类型存储原始 MDX 内容
            description: 'MDX 格式的文档内容，支持 Markdown 和 React 组件',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'category',
            title: '所属分类',
            type: 'reference',
            to: [{ type: 'docCategory' }],
            description: '此文档在知识库侧边栏中的归属分类',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'order',
            title: '排序序号',
            type: 'number',
            description: '在所属分类下的显示顺序，数字越小越靠前',
            initialValue: 0,
            validation: (Rule) => Rule.required().integer().min(0),
        }),
    ],
    preview: {
        select: {
            title: 'title',
            categoryTitle: 'category.title',
            order: 'order',
        },
        prepare({ title, categoryTitle, order }) {
            return {
                title: `${title}`,
                subtitle: `分类: ${categoryTitle || '未分类'} • 序号: ${order}`,
            }
        },
    },
})
