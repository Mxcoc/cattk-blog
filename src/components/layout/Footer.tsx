/*
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
*/

// 解决主题按钮 与 版权信息行错乱问题，上面注释的是原代码
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

export function Footer() {
  return (
    <footer className="mt-6 flex-none">
      <ContainerOuter>
        <div className="border-t border-muted pb-10 pt-10">
          <ContainerInner>
            {/* 主要改动：
              1. 删除了 sm:flex-row 和 justify-between，强制在所有屏幕上都使用垂直布局。
              2. 添加了 items-center 使所有行内容水平居中。
              3. 调整了 gap-6 作为行间距。
            */}
            <div className="flex flex-col items-center gap-6">

              {/* 第一行：导航菜单栏 */}
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium">
                {footerItems.map((item) => (
                  <NavLink key={item.name} href={item.href}>{item.name}</NavLink>
                ))}
              </div>

              {/* 第二行：版权信息 */}
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} {name}. All rights reserved.
              </p>

              {/* 第三行：社交图标与主题切换
                - 使用一个新的 flex 容器将主题切换按钮和社交链接放在一行。
                - ThemeToggle 组件被移到了 SocialLinks 组件的前面。
              */}
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <SocialLinks />
              </div>
              
            </div>
          </ContainerInner>
        </div>
      </ContainerOuter>
    </footer>
  )
}

