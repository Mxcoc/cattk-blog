
import { Container } from '@/components/layout/Container'
import Feed from '@/components/home/Feed'
import SocialLinks from '@/components/home/SocialLinks'
import { headline, introduction } from '@/config/infoConfig'
import { BlogCard } from '@/components/blog/BlogCard'
import { getAllBlogs, type BlogType } from '@/lib/blogs'
import { techIcons, } from '@/config/infoConfig'
import { CustomIcon } from '@/components/shared/CustomIcon'
import IconCloud from "@/components/ui/icon-cloud";
import Link from 'next/link'
import { ChevronRightIcon } from 'lucide-react'

// 首页按钮定义
{/*
const ActionButton = ({ href, children }: { href: string, children: React.ReactNode }) => {
  return (
    <Link
      href={href}
      className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {children}
    </Link>
  )
}
// 以上按钮定义
*/}
export default async function Home() {
  let blogList = (await getAllBlogs()).slice(0, 10)
  // console.log('blogList: ', blogList)

  return (
    <>
      <Container className="mt-9">
        {/* personal info */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-2">
          <div className='md:mt-20'>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl opacity-80">
              {headline}
            </h2>
            <p className="mt-6 text-base text-muted-foreground">
              {introduction}
            </p>
{/*
            <SocialLinks className='md:mt-24'/>
// 隐藏首页个人介绍与技术云图标之间的社交图标行
*/}
          </div>

          <div className="relative flex size-full items-center justify-center overflow-hidden w-full px-20 md:px-0 md:w-2/3 ml-auto md:mr-8">
            <IconCloud iconSlugs={techIcons} />
          </div>
            {/* 新增代码: 在这里添加按钮 */}
            {/* 您可以修改按钮的文字和链接 (href) */}
{/*
            <div className="mt-8 flex gap-x-4">
              <ActionButton href="/blogs">我的博客</ActionButton>
              <ActionButton href="/memos">我的动态</ActionButton>
              <ActionButton href="/about">关于我</ActionButton>
            </div>
*/}
        </div>

        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-10 lg:max-w-none lg:grid-cols-1 pb-4">
          {/* left column */}
          {/* blog */}
{/*
          <div className="flex flex-col gap-16">
            {blogList.map((blog: BlogType) => (
              <BlogCard key={blog.slug} blog={blog}/>
            ))}
            <Link href="/blogs" className="flex flex-row items-center text-sm text-primary hover:underline capitalize font-semibold">Read more blogs 
              <ChevronRightIcon className="ml-1 h-4 w-4 stroke-current" />
            </Link>
          </div>
*/}
          {/* right column */}
            <Feed />
        </div>
      </Container>
    </>
  )
}
