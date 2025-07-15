// site config
export const utm_source = process.env.NEXT_PUBLIC_UTM_SOURCE
export const site_url = process.env.NEXT_PUBLIC_SITE_URL

// navigation config
type NavItemType = {
  name: string
  href: string
}

export const footerItems: Array<NavItemType> = [
  {
    name: 'Home',
    href: '/'
  },
  {
    name: 'About',
    href: '/about'
  },
  {
    name: 'Blogs',
    href: '/blogs'
  },
  {
    name: 'Categories',
    href: '/categories'
  },
  {
    name: 'Tags',
    href: '/tags'
  },
  {
    name: 'Friends',
    href: '/friends'
  },
  {
    name: 'Changelog',
    href: '/changelog'
  }
]

export const navItems: Array<NavItemType> = [
  {
    name: 'Home',
    href: '/'
  },
  // 在 navLinks 数组中添加这一行
  {
     name: 'Memos',
     href: '/memos'
  },
  {
    name: 'Blog',
    href: '/blogs'
  },
  {
    name: 'About',
    href: '/about'
  }
]
