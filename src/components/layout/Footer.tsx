import Link from 'next/link'

import { ContainerInner, ContainerOuter } from '@/components/layout/Container'
import { footerItems } from '@/config/siteConfig'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { name } from '@/config/infoConfig'
import SocialLinks from '@/components/home/SocialLinks'

function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="transition hover:text-primary"
    >
      {children}
    </Link>
  )
}

{/*
export function Footer() {
  return (
    <footer className="mt-6 flex-none">
      <ContainerOuter>
        <div className="border-t border-muted pb-10 pt-10">
          <ContainerInner>
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-start">
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium">
                {footerItems.map((item) => (
                  <NavLink key={item.name} href={item.href}>{item.name}</NavLink>
                ))}
              </div>
              <div className='flex flex-col justify-center items-start'>
                <div className='flex flex-row justify-end items-center gap-2'>
                  <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} {name}. All rights reserved.
                  </p>
                  <ThemeToggle />
                </div>
                <SocialLinks className='mt-0'/>
              </div>
            </div>
          </ContainerInner>
        </div>
      </ContainerOuter>
    </footer>
  )
}
*/}


// 解决主题按钮 与 版权信息行错乱问题，上面注释的是原代码
export function Footer() {
  return (
    <footer className="mt-6 flex-none">
      <ContainerOuter>
        <div className="border-t border-muted pb-10 pt-10">
          <ContainerInner>
            {/* 主容器：在小屏幕上垂直堆叠，在 sm 及以上屏幕水平排列 */}
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-center">
              
              {/* 左侧：导航链接 */}
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium">
                {footerItems.map((item) => (
                  <NavLink key={item.name} href={item.href}>{item.name}</NavLink>
                ))}
              </div>
              
              {/* 右侧：版权、主题切换、社交链接 */}
              <div className='flex flex-col items-center sm:items-end'>
                
                {/* -- 关键改动在这里 -- */}
                {/* 这个 div 控制版权和主题切换按钮的布局 */}
                <div className='flex items-center gap-4'>
                  <p className="text-sm text-muted-foreground whitespace-nowrap">
                    &copy; {new Date().getFullYear()} {name}. All rights reserved.
                  </p>
                  <ThemeToggle />
                </div>

                {/* 社交链接现在与上方内容有一定间距 */}
                <SocialLinks className='mt-4'/>
              </div>

            </div>
          </ContainerInner>
        </div>
      </ContainerOuter>
    </footer>
  )
}
