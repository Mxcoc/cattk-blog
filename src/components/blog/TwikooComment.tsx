'use client' // 声明这是一个客户端组件，因为需要操作 DOM

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

const TwikooComment = () => {
  const { theme } = useTheme() // 获取当前的主题（'light' 或 'dark'）

  useEffect(() => {
    // 动态创建并加载 Twikoo 的 JS 脚本
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/twikoo@1.6.36/dist/twikoo.all.min.js' // 你可以使用官方 CDN 或你自己的 CDN
    script.async = true

    script.onload = () => {
      // 脚本加载成功后，初始化 Twikoo
      try {
        // @ts-ignore
        twikoo.init({
          envId: 'https://twikoo.cattk.com', // 替换成你自己的 Twikoo 服务地址
          el: '#twikoo-comment', // 挂载评论区的 DOM 元素 ID
          // lang: 'zh-CN', // 可选：设置语言
        })
      } catch (e) {
        console.error('Twikoo init failed', e)
      }
    }

    document.head.appendChild(script)

    // 组件卸载时，清理脚本
    return () => {
      document.head.removeChild(script)
    }
  }, []) // 空依赖数组，确保这个 effect 只运行一次

  useEffect(() => {
    // 当网站主题变化时，通知 Twikoo 切换主题
    const commentContainer = document.getElementById('twikoo-comment')
    if (commentContainer && commentContainer.innerHTML) {
      try {
        // @ts-ignore
        twikoo.destroy() // 先销毁旧实例
        // @ts-ignore
        twikoo.init({
          envId: 'https://twikoo.cattk.com', // 再次替换成你的服务地址
          el: '#twikoo-comment',
          // lang: 'zh-CN',
        })
      } catch (e) {
        console.error('Twikoo re-init failed', e)
      }
    }
  }, [theme]) // 依赖于主题变化

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
        评论区
      </h2>
      <div id="twikoo-comment" className="prose dark:prose-invert mt-6">
        {/* Twikoo 评论区将会被挂载到这里 */}
      </div>
    </div>
  )
}

export default TwikooComment
