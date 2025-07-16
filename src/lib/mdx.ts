{/*

import { compileMDX } from 'next-mdx-remote/rsc'
import { promises as fs } from 'fs'
import path from 'path'
import { mdxComponents } from '@/components/shared/MdxComponents'

export async function getMDXContent(slug: string) {
  const filePath = path.join(process.cwd(), 'src/content/blog', `${slug}.mdx`)
  const source = await fs.readFile(filePath, 'utf-8')
  
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: { parseFrontmatter: true }
  })
  
  return content
}

*/}
// 以上是原代码

import { compileMDX } from 'next-mdx-remote/rsc'
import { promises as fs } from 'fs'
import path from 'path'
// 注意：你的组件映射变量名是 mdxComponents，而不是 MdxComponents
import { mdxComponents } from '@/components/shared/MdxComponents' 

// 改为接收 folder 和 slug 两个参数，使其更通用
export async function getMDXContent(folder: string, slug: string) {
  const filePath = path.join(process.cwd(), 'src', 'content', folder, `${slug}.mdx`)
  const source = await fs.readFile(filePath, 'utf-8')
  
  // 同时获取 content 和 frontmatter
  const { content, frontmatter } = await compileMDX({
    source,
    components: mdxComponents, // 使用你定义的组件
    options: { parseFrontmatter: true }
  })
  
  // 返回一个包含两者的对象
  return { content, frontmatter }
}
