
export * from './friends'
export * from './changelog'


// personal info
export const name = "Cattk"
export const headline = '吃枣药丸.'
export const introduction = 'Cattk | 业余无线电 HAM | 短波通信玩家 | 电子 DIY 爱好者。用天线捕捉远方的故事，用焊烙铁筑造心中的奇思。'
export const email = 'cattk@cattk.com'
export const githubUsername = 'Mxcoc'


// about page
export const aboutMeHeadline = "I'm Cattk."
export const aboutParagraphs = [
  "I love coding. I learned programming when I in college. I wrote my first program in Java when I was 18.",
]


// blog
export const blogHeadLine = "TEST."
export const blogIntro = "123456789."


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
  }
]

// https://simpleicons.org/
export const techIcons = [
  "javascript",
  "cloudflare",
  "java",
  "mysql",
  "postgresql",
  "nginx",
  "vercel",
  "docker",
  "git",
  "github",
  "ios",
  "apple",
  "htmx"
];



