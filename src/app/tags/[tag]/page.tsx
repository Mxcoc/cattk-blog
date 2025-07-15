// src/app/tags/[tag]/page.tsx
import { type Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { getBlogsByTag, type BlogType } from '@/lib/blogs'
import { BlogCard } from '@/components/blog/BlogCard' // 使用我们新的共享组件

interface Props {
  params: {
    tag: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = decodeURIComponent(params.tag)
  return {
    title: `标签: ${tag}`,
    description: `所有标记为 "${tag}" 的文章。`,
  }
}

export default async function TagPage({ params }: Props) {
  const tag = decodeURIComponent(params.tag)
  const blogs = await getBlogsByTag(tag)

  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          标签：<span className="text-primary">{tag}</span>
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
