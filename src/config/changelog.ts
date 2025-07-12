// changelog
export const changelogHeadLine = "What's new about this site"
export const changelogIntro = "Check out the latest changes to this site."


// changelog
export type ChangelogItemType = {
  date: string
  content: [{
    title: string
    description: string
  }]
}

export const changelogList: Array<ChangelogItemType> = [
  {
    date: '2025-07-1',
    content: [
      {
        title: 'test',
        description: '待更新……'
      },
    ]
  }
]