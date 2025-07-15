// src/components/blog/BlogCard.tsx

import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/formatDate'
import { type BlogType } from '@/lib/blogs'

export function BlogCard({ blog }: { blog: BlogType }) {
  return (
    <Link href={`/blogs/${blog.slug}`}>
      <article className="group relative flex flex-col items-start">
        {/* 图片部分 */}
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
          {blog.description && (
            <p className="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {blog.description}
            </p>
          )}

          {/* --- 新增代码在这里 --- */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {/* 分类显示 (如果存在) */}
            {blog.category && (
              <span className="relative z-10 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                {blog.category}
              </span>
            )}

            {/* 标签显示 (如果存在) */}
            {blog.tags?.map(tag => (
              <span
                key={tag}
                className="relative z-10 inline-block rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              >
                #{tag}
              </span>
            ))}
          </div>

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
