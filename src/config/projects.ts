// projects
export const projectHeadLine = "TEST"
export const projectIntro = "TEST"

export type ProjectItemType = {
    name: string
    description: string
    link: { href: string, label: string }
    date?: string
    logo?: string,
    category?: string[],
    tags?: string[],
    image?: string,
    techStack?: string[],
    gitStars?: number,
    gitForks?: number
  }
  
  // projects 
  export const projects: Array<ProjectItemType> = [
    {
      name: 'User Growth',
      description:
        'Boost Your business growth with UserGrowth.link',
      link: { href: 'usergrowth.link', label: 'User Growth' },
      logo: '/images/icon/usergrowth.ico',
      category: ['Website'],
      techStack: ['Next.js', 'TailwindCSS', 'Shadcn/UI'],
      tags: ['User Growth', 'Marketing', 'SEO']
    }
  ]
  