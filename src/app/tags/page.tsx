// src/app/tags/page.tsx
import { type Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { getAllTags } from '@/lib/blogs'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '标签',
  description: '博客中使用的所有标签。',
}

export default async function TagsPage() {
  const tags = await getAllTags()

  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          所有标签
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          点击标签可以查看该标签下的所有文章。
        </p>
      </header>
      <div className="mt-16 sm:mt-20">
        <div className="flex flex-wrap gap-4">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="inline-block rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              {tag} ({/* 这里可以添加显示该标签下文章数量的功能 */})
            </Link>
          ))}
        </div>
      </div>
    </Container>
  )
}
