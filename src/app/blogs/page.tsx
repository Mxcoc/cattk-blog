// src/app/blogs/page.tsx

import { type Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { type BlogType, getAllBlogs } from '@/lib/blogs'
import { formatDate } from '@/lib/formatDate'
import Link from 'next/link'
import Image from 'next/image'


// Card 组件，用于展示单个博客文章
{/*
function BlogCard({ blog }: { blog: BlogType }) {
  return (
    <article className="relative flex flex-col items-start">
      <h2 className="text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
        <Link href={`/blogs/${blog.slug}`}>
          <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
          <span className="relative z-10">{blog.title}</span>
        </Link>
      </h2>
      <time
        className="relative z-10 order-first mb-3 flex items-center pl-3.5 text-sm text-zinc-400 dark:text-zinc-500"
        dateTime={blog.date}
      >
        <span
          className="absolute inset-y-0 left-0 flex items-center"
          aria-hidden="true"
        >
          <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
        </span>
        {formatDate(blog.date)}
      </time>
      <p className="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {blog.description}
      </p>
      <div
        aria-hidden="true"
        className="relative z-10 mt-4 flex items-center text-sm font-medium text-primary"
      >
        Read article
      </div>
    </article>
  )
}
*/}

// Card 组件，用于展示单个博客文章
function BlogCard({ blog }: { blog: BlogType }) {
  return (
    // 将整个卡片包裹在 Link 组件中，使其全部可点击
    <Link href={`/blogs/${blog.slug}`}>
      <article className="group relative flex flex-col items-start">
        {/* 图片部分：仅当 coverImage 存在时渲染 */}
        {blog.coverImage && (
          <div className="relative w-full aspect-video mb-6 overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover object-center transition-all duration-300 group-hover:scale-105"
            />
          </div>
        )}

        {/* 文字部分 */}
        <div className="flex w-full flex-col">
          <time
            className="relative z-10 order-first mb-3 flex items-center pl-3.5 text-sm text-zinc-400 dark:text-zinc-500"
            dateTime={blog.date}
          >
            <span
              className="absolute inset-y-0 left-0 flex items-center"
              aria-hidden="true"
            >
              <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
            </span>
            {formatDate(blog.date)}
          </time>
          <h2 className="text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
            {blog.title}
          </h2>
          {/* description 部分也做个判断，如果不存在就不渲染 */}
          {blog.description && (
            <p className="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {blog.description}
            </p>
          )}
          <div
            aria-hidden="true"
            className="relative z-10 mt-4 flex items-center text-sm font-medium text-primary"
          >
            Read article
          </div>
        </div>
      </article>
    </Link>
  )
}


// 主页面组件
export default async function BlogsIndex() {
  const blogs = await getAllBlogs()

  return (
    <Container className="mt-16 sm:mt-32">
      {/* 这里可以保留一个简单的标题，如果需要的话 */}
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          Cattk&apos;s Blog
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          在这里，我记录技术、分享生活、沉淀思考。
        </p>
      </header>
      <div className="mt-16 sm:mt-20">
        <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
          <div className="flex max-w-3xl flex-col space-y-16">
            {blogs.map((blog) => (
              <BlogCard key={blog.slug} blog={blog} />
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}
