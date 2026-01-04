import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@sanity/client'
import { fileURLToPath } from 'url'

// --- Configuration ---
const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id'
const DATASET = process.env.SANITY_STUDIO_DATASET || 'production'
const API_TOKEN = process.env.SANITY_API_TOKEN // Needs write access
const DOCS_DIR = path.resolve(process.cwd(), 'docs-source') // Place your markdown files here for import

// 环境变量检查
if (!API_TOKEN || API_TOKEN === 'your-write-token-here') {
    console.error('❌ SANITY_API_TOKEN 环境变量未设置或无效')
    console.log('\n请按照以下步骤获取 API Token：')
    console.log('1. 访问：https://sanity.io/manage')
    console.log('2. 选择你的项目')
    console.log('3. 进入 API -> Tokens')
    console.log('4. 点击 "Add API token"，权限选择 Editor 或 Administrator')
    console.log('5. 将生成的 token 设置为环境变量 SANITY_API_TOKEN\n')
    process.exit(1)
}

if (!PROJECT_ID || PROJECT_ID === 'your-project-id') {
    console.error('❌ SANITY_STUDIO_PROJECT_ID 环境变量未设置')
    process.exit(1)
}

// --- Types ---
interface DocCategory {
    _id: string
    _type: 'docCategory'
    title: string
    slug: { _type: 'slug'; current: string }
    order: number
    parentCategory?: { _type: 'reference'; _ref: string }
}

interface DocPage {
    _id: string
    _type: 'docPage'
    title: string
    slug: { _type: 'slug'; current: string }
    content: string
    category: { _type: 'reference'; _ref: string }
    order: number
}

// --- Helpers ---

// Simple frontmatter parser to avoid dependencies
function parseFrontmatter(content: string): { data: any; content: string } {
    const match = content.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n)+([\s\S]*)$/)
    if (!match) return { data: {}, content }

    const frontmatterRaw = match[1]
    const body = match[2]
    const data: any = {}

    frontmatterRaw.split('\n').forEach((line) => {
        const [key, ...valueParts] = line.split(':')
        if (key && valueParts.length > 0) {
            let value = valueParts.join(':').trim()
            // Remove quotes if present
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1)
            } else if (value.startsWith("'") && value.endsWith("'")) {
                value = value.slice(1, -1)
            }
            // Handle arrays (simple comma separated)
            if (value.startsWith('[') && value.endsWith(']')) {
                data[key.trim()] = value.slice(1, -1).split(',').map(s => s.trim())
            } else {
                data[key.trim()] = value
            }
        }
    })

    return { data, content: body }
}

function generateId(type: string, slug: string) {
    return `${type}-${slug}`.replace(/[^a-zA-Z0-9-_]/g, '-')
}

// --- Main Logic ---

async function main() {
    console.log(`📚 开始扫描文档目录: ${DOCS_DIR}`)

    if (!fs.existsSync(DOCS_DIR)) {
        console.error(`❌ 目录不存在: ${DOCS_DIR}`)
        console.log('请创建 docs-source/ 目录并添加你的 Markdown 文档文件')
        console.log('参考目录结构：docs-source/README.md\n')
        return
    }

    const categories: DocCategory[] = []
    const pages: DocPage[] = []

    function processDirectory(dirPath: string, parentId?: string) {
        const items = fs.readdirSync(dirPath)

        // Filter and sort items
        const sortedItems = items.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

        sortedItems.forEach((item, index) => {
            const fullPath = path.join(dirPath, item)
            const stats = fs.statSync(fullPath)

            if (stats.isDirectory()) {
                // It's a category
                const metaPath = path.join(fullPath, '_meta.json')
                let meta: any = { title: item, slug: item }

                if (fs.existsSync(metaPath)) {
                    try {
                        meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
                    } catch (e) {
                        console.warn(`⚠️  解析 _meta.json 失败: ${fullPath}`)
                    }
                }

                const slug = meta.slug || item
                const categoryId = generateId('cat', slug)

                categories.push({
                    _id: categoryId,
                    _type: 'docCategory',
                    title: meta.title || item,
                    slug: { _type: 'slug', current: slug },
                    order: meta.order !== undefined ? meta.order : index,
                    parentCategory: parentId ? { _type: 'reference', _ref: parentId } : undefined
                })

                processDirectory(fullPath, categoryId)

            } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
                // It's a page
                const fileContent = fs.readFileSync(fullPath, 'utf-8')
                const { data, content } = parseFrontmatter(fileContent)

                if (!parentId) {
                    console.warn(`⚠️  跳过根目录文件 ${item}（文档必须放在分类目录下）`)
                    return
                }

                const slug = data.slug || path.basename(item, path.extname(item))
                const pageId = generateId('page', slug)

                pages.push({
                    _id: pageId,
                    _type: 'docPage',
                    title: data.title || path.basename(item, path.extname(item)),
                    slug: { _type: 'slug', current: slug },
                    content: content,
                    category: { _type: 'reference', _ref: parentId },
                    order: data.order !== undefined ? parseInt(data.order) : index
                })
            }
        })
    }

    processDirectory(DOCS_DIR)

    // Output NDJSON
    const output = [
        ...categories.map(c => JSON.stringify(c)),
        ...pages.map(p => JSON.stringify(p))
    ].join('\n')

    const ioDir = path.join(process.cwd(), 'io')
    if (!fs.existsSync(ioDir)) {
        fs.mkdirSync(ioDir, { recursive: true })
    }
    const outputPath = path.join(ioDir, 'docs-import.ndjson')
    fs.writeFileSync(outputPath, output)

    console.log(`\n✅ 导入文件已生成: ${outputPath}`)
    console.log(`📊 统计: ${categories.length} 个分类，${pages.length} 个文档`)
    console.log(`\n执行以下命令导入到 Sanity：`)
    console.log(`   sanity dataset import ${outputPath} ${DATASET} --replace\n`)
}

main().catch(console.error)

