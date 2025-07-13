import { type Metadata } from 'next'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/layout/Layout'
import { Analytics } from "@/components/analytics/analytics";
import { name, headline, introduction } from '@/config/infoConfig'
import '@/styles/tailwind.css'
import Script from 'next/script'


export const metadata: Metadata = {
  title: {
    template: `%s - ${name}`,
    default:
      `${name} - ${headline}`,
  },
  description:
    `${introduction}`,
  alternates: {
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed`,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex h-full">
        <Providers>
          <div className="flex w-full">
            <Layout>{children}</Layout>
          </div>
          <Analytics />
        </Providers>

      {/* 在这里添加 Umami 的追踪脚本 */}
      <Script 
        async 
        src="https://umami-luhv.vercel.app/script.js" // <-- 替换成你自己的 Umami 服务域名
        data-website-id="4e2dc115-1abf-4b71-a33b-7eb5aa4d6019" // <-- 替换成你自己的网站追踪 ID
      />

      </body>
    </html>
  )
}
