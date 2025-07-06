export * from './projects'
export * from './friends'
export * from './changelog'
export * from './education'
export * from './career'
export * from './activity'


// personal info
export const name = "Cattk"
export const headline = '吃枣药丸.'
export const introduction = 'Cattk | 业余无线电 HAM | 短波通信玩家 | 电子 DIY 爱好者。用天线捕捉远方的故事，用焊烙铁筑造心中的奇思。'
export const email = 'cattk@cattk.com'
export const githubUsername = 'Mxcoc'


// about page
// export const aboutMeHeadline = "I'm Corey Chiu, a software engineer based in Shenzhen, China."
// export const aboutParagraphs = [
//   "I love coding. I learned programming when I in college. I wrote my first program in Java when I was 18.",
//   "I have a lot of hobbies, such as travelling, photography, watching movies, music and so on.",
//   "I'm working as a software develop engineer in Shenzhen, China now. And I'm building a lot of side projects in my spare time."
// ]



// blog
export const blogHeadLine = "What I've thinking about."
export const blogIntro = "I've written something about AI, programming and life."


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
    href: 'https://github.com/iamcorey',
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



