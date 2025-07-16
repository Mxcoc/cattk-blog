// src/app/now/page.tsx
import { type Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { getMDXContent } from '@/lib/mdx' // 假设你有一个通用的 MDX 读取函数

export const metadata: Metadata = {
  title: '此刻',
  description: '我最近在做什么，在想什么。',
}

export default async function NowPage() {
  // 从 src/content/pages/now.mdx 读取内容
  const { content, frontmatter } = await getMDXContent('pages', 'now')

  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          {frontmatter.title}
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          {frontmatter.description}
        </p>
      </header>
      <div className="mt-16 sm:mt-20">
        <div className="prose dark:prose-invert max-w-none">
          {content}
        </div>
      </div>
    </Container>
  )
}
