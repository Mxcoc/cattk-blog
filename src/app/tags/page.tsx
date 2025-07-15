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
  // 获取到的 tags 现在是 [{ name: 'React', count: 5 }, ...]
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
          {/* 修改这里的 map 函数来处理新的数据结构 */}
          {tags.map((tag) => (
            <Link
              key={tag.name}
              href={`/tags/${encodeURIComponent(tag.name)}`}
              className="inline-flex items-center justify-center rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              {/* 显示标签名 */}
              {tag.name}
              {/* 显示带样式的文章数量 */}
              <span className="ml-2 rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-200">
                {tag.count}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  )
}
