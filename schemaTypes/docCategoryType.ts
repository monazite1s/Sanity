import { defineField, defineType } from 'sanity'

/**
 * 知识库分类目录 Schema
 * 支持多级嵌套，用于构建类似 VuePress 的侧边栏导航
 */
export const docCategoryType = defineType({
    name: 'docCategory',
    title: '知识库分类',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: '分类名称',
            type: 'string',
            description: '例如：React 基础、Hooks 进阶、TypeScript 类型系统',
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
            description: '自动从名称生成，用于构建分类 URL',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'order',
            title: '排序序号',
            type: 'number',
            description: '在侧边栏中的显示顺序，数字越小越靠前',
            initialValue: 0,
            validation: (Rule) => Rule.required().integer().min(0),
        }),
        defineField({
            name: 'parentCategory',
            title: '父级分类',
            type: 'reference',
            to: [{ type: 'docCategory' }],
            description: '留空则为顶级分类，选择后成为该分类的子分类（支持无限嵌套）',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            parentTitle: 'parentCategory.title',
            order: 'order',
        },
        prepare({ title, parentTitle, order }) {
            return {
                title: `${title}`,
                subtitle: parentTitle ? `父级: ${parentTitle} • 序号: ${order}` : `顶级分类 • 序号: ${order}`,
            }
        },
    },
})
