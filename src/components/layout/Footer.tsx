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
// src/components/layout/Footer.tsx

import Link from 'next/link'

import { ContainerInner, ContainerOuter } from '@/components/layout/Container'
import { footerItems } from '@/config/siteConfig'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { name } from '@/config/infoConfig'
import SocialLinks from '@/components/home/SocialLinks'
// 假设你有一个 VisitData 组件用于显示统计，如果没有请删除此行和下面的 <VisitData />
// import VisitData from '@/components/layout/VisitData'


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
    <footer className="mt-32 flex-none">
      <ContainerOuter>
        <div className="border-t border-muted pb-16 pt-10">
          <ContainerInner>
            {/* 主容器：
              - 手机端(默认): flex-col, 垂直堆叠, 居中对齐
              - 电脑端(sm:): flex-row, 水平排列, 顶部对齐, 两端对齐
            */}
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-start">
              
              {/* 左侧：导航链接 */}
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium">
                {footerItems.map((item) => (
                  <NavLink key={item.name} href={item.href}>{item.name}</NavLink>
                ))}
              </div>
              
              {/* 右侧：垂直堆叠的容器 */}
              <div className='flex flex-col justify-center items-center sm:items-start'>
                
                {/* 第一行：版权和主题切换 */}
                <div className='flex flex-row justify-end items-center gap-2'>
                  <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} {name}. All rights reserved.
                  </p>
                  <ThemeToggle />
                </div>
                
                {/* 第二行：社交链接 */}
                <SocialLinks className='mt-4'/>

                {/* 第三行：访客统计 (如果不需要，可以删除这一行) */}
                {/* <VisitData /> */}
              </div>

            </div>
          </ContainerInner>
        </div>
      </ContainerOuter>
    </footer>
  )
}

