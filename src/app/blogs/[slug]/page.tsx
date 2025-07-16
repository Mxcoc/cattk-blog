import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBlogBySlug } from '@/lib/blogs'
import { getMDXContent } from '@/lib/mdx'
import { BlogLayout } from '@/components/layout/BlogLayout'
import TwikooComment from '@/components/blog/TwikooComment'
import Link from 'next/link'

export const runtime = process.env.NEXT_RUNTIME === 'edge' ? 'edge' : 'nodejs'

interface Props {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug)
  if (!blog) {
    return {
      title: 'Blog not found',
    }
  }

  return {
    title: blog.title,
    description: blog.description,
  }
}

export default async function BlogPage({ params }: Props) {
  const blog = await getBlogBySlug(params.slug)
  
  if (!blog) {
    notFound()
  }

  // --- 关键改动 1: 在这里解构出 content 和 frontmatter ---
  // 并将 content 重命名为 mdxContent，以避免变量名混淆
  const { content: mdxContent, frontmatter } = await getMDXContent('blog', params.slug)

  return (
    <BlogLayout blog={blog}>

      {/* 你新增的分类和标签代码 (保持不变) */}
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        {blog.category && (
          <Link 
            href={`/categories/${encodeURIComponent(blog.category)}`}
            className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800 transition hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900"
          >
            {blog.category}
          </Link>
        )}
        {blog.tags?.map(tag => (
          <Link 
            key={tag} 
            href={`/tags/${encodeURIComponent(tag)}`} 
            className="text-zinc-600 transition hover:text-primary dark:text-zinc-400 dark:hover:text-primary"
          >
            #{tag}
          </Link>
        ))}
      </div>
      
      {/* 文章正文 */}
      <div className="mt-8 prose dark:prose-invert max-w-none">
        {/* --- 关键改动 2: 在这里渲染 mdxContent --- */}
        {mdxContent}
      </div>

      {/* 评论组件 (保持不变) */}
      <TwikooComment />

    </BlogLayout>
  )
}

