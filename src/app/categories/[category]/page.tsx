// src/app/categories/[category]/page.tsx
import { type Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { getBlogsByCategory, type BlogType } from '@/lib/blogs'
import { BlogCard } from '@/components/blog/BlogCard'

interface Props {
  params: {
    category: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = decodeURIComponent(params.category)
  return {
    title: `分类: ${category}`,
    description: `所有分类为 "${category}" 的文章。`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const category = decodeURIComponent(params.category)
  const blogs = await getBlogsByCategory(category)

  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          分类：<span className="text-primary">{category}</span>
        </h1>
        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
          共找到 {blogs.length} 篇文章。
        </p>
      </header>
      <div className="mt-16 sm:mt-20">
        <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
          <div className="flex max-w-3xl flex-col space-y-16">
            {blogs.map((blog: BlogType) => (
              <BlogCard key={blog.slug} blog={blog} />
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}
