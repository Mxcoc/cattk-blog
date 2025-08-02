{/*
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

import Link from 'next/link'
import { ContainerInner, ContainerOuter } from '@/components/layout/Container'
import { footerItems } from '@/config/siteConfig'
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
            {/* 主容器 - 恢复您最初的设定，仅做微调
              - 默认(手机): 垂直堆叠 (flex-col), 居中 (items-center)
              - sm及以上(桌面): 水平排列 (sm:flex-row), 两端对齐 (justify-between), 顶部对齐 (sm:items-start)
            */}
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-start">
              
              {/* 左侧：导航链接 (保持不变) */}
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium">
                {footerItems.map((item) => (
                  <NavLink key={item.name} href={item.href}>{item.name}</NavLink>
                ))}
              </div>

              {/* 右侧：版权和社交图标 (这是唯一的、关键的修改点)
                - 默认(手机): 垂直堆叠 (flex-col), 内容居中 (items-center)
                - sm及以上(桌面): 内容靠右对齐 (sm:items-end)
              */}
              <div className="flex flex-col items-center gap-4 sm:items-end">
                <p className="text-sm text-muted-foreground">
                  {'© '}{new Date().getFullYear()} {name}{'. All rights reserved.'}
                </p>
                <SocialLinks />
              </div>

            </div>
          </ContainerInner>
        </div>
      </ContainerOuter>
    </footer>
  )
}
