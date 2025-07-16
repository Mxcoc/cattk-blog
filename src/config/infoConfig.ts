
export * from './friends'
export * from './changelog'


// personal info
export const name = "Cattk"
export const headline = '吃枣药丸.'
export const introduction = 'Cattk | 业余无线电 HAM | 短波通信玩家 | 电子 DIY 爱好者。用天线捕捉远方的故事，用焊烙铁筑造心中的奇思。'
export const email = 'cattk@cattk.com'
export const githubUsername = 'Mxcoc'


// about page
export const aboutMeHeadline = "欢迎来到 Cattk 的频率!"
export const aboutParagraphs = [
  "你好，朋友！
我是 Cattk，很高兴你能在茫茫的比特海中发现我的这片小小空间。
你或许会好奇，Cattk 是个怎样的人？
在电波中，我寻找共鸣。
我是一名业余无线电爱好者（火腿，呼号 [请在这里填写你的呼号]），深深着迷于那些看不见却能跨越山海的电波。对我而言，每一次调试天线，每一次在噪声中捕捉到微弱的信号，都是一次激动人心的冒险。这不仅仅是技术上的挑战，更是对远方未知朋友的一次呼唤与问候。
在电路板上，我创造可能。
我的世界里，焊锡的松香味和万用表的蜂鸣声是常态。我享受那种沉浸式的专注——将一个个冰冷的元器件，亲手赋予它们生命与功能。从一个想法，到一张图纸，再到一个能闪烁、能鸣响的实体，这个过程充满了魔法般的创造力。
在数码世界里，我体验未来。
作为一个标准的“数码控”，我无法抗拒新科技的魅力。我喜欢拆解、研究、评测那些最新的电子产品，去探寻它们的设计巧思，去感受它们如何一点点地改变着我们的生活。在这里，我会分享我的使用体验，或许能为你提供一些不一样的视角。
在旋律中，我获得宁静。
当然，生活不只有比特和电波。音乐是我灵魂的庇护所。无论是安静的午后，还是深夜钻研的时刻，一段合适的旋律总能让我找到内心的平静与力量。
这个博客，就是我存放这些热情的地方。我希望通过文字和图片，与你分享探索的乐趣，记录创造的艰辛，交流彼此的感悟。
无论你是资深玩家还是入门新手，都欢迎你随时留言。期待与你思想的碰撞！
祝好，73！
Cattk",
]

{/*
// blog
export const blogHeadLine = "TEST."
export const blogIntro = "123456789."
*/}

// social links
export type SocialLinkType = {
  name: string,
  ariaLabel?: string,
  icon: string,
  href: string,
  external?: boolean
}

export const socialLinks: Array<SocialLinkType> = [
  {
    name: 'X',
    icon: 'x',
    href: 'https://x.com/#',
    external: true
  },
  {
    name: 'Github',
    icon: 'github',
    href: 'https://github.com/#',
    external: true
  },
  {
    name: 'Telegram',
    icon: 'telegram',
    href: '#',
    external: true
  },
  {
    name: 'Instagram',
    icon: 'instagram',
    href: '#',
    external: true
  },
  {
    name: 'RSS',
    icon: 'rss',
    href: 'https://cattk.com/feed',
    external: true
  }
]

// https://simpleicons.org/
export const techIcons = [
  "/icons/apple.svg",
  "/icons/bilibili.svg",
  "/icons/cloudflare.svg",
  "/icons/docker.svg",
  "/icons/github.svg",
  "/icons/htmx.svg",
  "/icons/ios.svg",
  "/icons/linux.svg",
  "/icons/macos.svg",
  "/icons/mysql.svg",
  "/icons/vercel.svg",
  "/icons/x.svg",
  "/icons/cattk.jpg"
];



