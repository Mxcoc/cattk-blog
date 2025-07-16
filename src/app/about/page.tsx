{/*
import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { aboutMeHeadline, aboutParagraphs } from '@/config/infoConfig'
import { Container } from '@/components/layout/Container'
import portraitImage from '@/images/portrait.jpg'
import SocialLinks from '@/components/about/SocialLinks'
import TwikooComment from '@/components/blog/TwikooComment'



export const metadata: Metadata = {
  title: 'About',
  description:
    '测试……',
}

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <Image
              src={portraitImage}
              alt=""
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            {aboutMeHeadline}
          </h1>
          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            {aboutParagraphs.map((paragraph, index) => (
              <p key={index}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <div className="lg:pl-20">
          <SocialLinks />
        </div>
      </div>

      // 在这里添加 Twikoo 评论组件
      <TwikooComment />

    </Container>
  )
}
*/}
// 以上代码为修改about页面为.mdx之前代码

// src/app/about/page.tsx

import { type Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { getMDXContent } from '@/lib/mdx'
import TwikooComment from '@/components/blog/TwikooComment' // 导入评论组件

// 从 frontmatter 动态生成页面的元数据
export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter } = await getMDXContent('pages', 'about')
  return {
    title: frontmatter.title as string,
    description: frontmatter.description as string,
  }
}

export default async function AboutPage() {
  // 获取 about.mdx 的内容和元数据
  const { content, frontmatter } = await getMDXContent('pages', 'about')

  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          {frontmatter.title as string}
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          {frontmatter.description as string}
        </p>
      </header>

      {/* 渲染 MDX 内容 */}
      <div className="mt-16 sm:mt-20">
        <div className="prose dark:prose-invert max-w-none">
          {content}
        </div>
      </div>

      {/* 保留你之前添加的评论功能 */}
      <TwikooComment />
    </Container>
  )
}
