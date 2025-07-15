// src/app/categories/page.tsx
import { type Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { getAllCategories } from '@/lib/blogs'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '分类',
  description: '博客中使用的所有分类。',
}

export default async function CategoriesPage() {
  const categories = await getAllCategories()

  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          所有分类
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          点击分类可以查看该分类下的所有文章。
        </p>
      </header>
      <div className="mt-16 sm:mt-20">
        <ul className="flex flex-wrap gap-4">
          {categories.map((category) => (
            <li key={category.name}>
              <Link
                href={`/categories/${encodeURIComponent(category.name)}`}
                className="inline-flex items-center justify-center rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                {category.name}
                <span className="ml-2 rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-200">
                  {category.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  )
}
