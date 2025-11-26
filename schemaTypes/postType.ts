import { defineField, defineType } from 'sanity'

/**
 * Post 文档类型 Schema
 * 支持 MDX 格式内容和博客元数据
 */
export const postType = defineType({
    name: 'post',
    title: 'Blog Post',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published at',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
            rows: 3,
            description: '文章摘要，用于列表页和 SEO',
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
        }),
        defineField({
            name: 'series',
            title: 'Series',
            type: 'string',
            description: '系列文章名称（可选）',
        }),
        defineField({
            name: 'body',
            title: 'Body',
            type: 'text',
            description: 'MDX 格式的文章内容',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'image',
            title: 'Cover Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative text',
                },
            ],
        }),
    ],
    preview: {
        select: {
            title: 'title',
            date: 'publishedAt',
            media: 'image',
            tags: 'tags',
        },
        prepare(selection) {
            const { title, date, tags } = selection
            const tagList = tags?.slice(0, 3).join(', ') || ''
            return {
                ...selection,
                title,
                subtitle: `${date ? new Date(date).toLocaleDateString() : 'No date'}${tagList ? ` • ${tagList}` : ''}`,
            }
        },
    },
})