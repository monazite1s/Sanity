import { defineField, defineType } from 'sanity'

/**
 * About 文档类型 Schema
 * 支持 MDX 格式内容和博客元数据
 */
export const aboutType = defineType({
    name: 'about',
    title: 'About Post',
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
        },
        prepare(selection) {
            const { title, date } = selection
            return {
                ...selection,
                title,
                subtitle: `${date ? new Date(date).toLocaleDateString() : 'No date'}`,
            }
        },
    },
})