{/*
import glob from 'fast-glob'
import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type BlogType = {
  title: string
  description: string
  author: string
  date: string
  slug: string
  coverImage?: string
  category?: string   // 新增：分类
  tags?: string[]     // 新增：标签数组
  views?: number      // 新增：阅读量
}


async function importBlog(
  blogFilename: string,
): Promise<BlogType> {
  const source = await fs.readFile(
    path.join(process.cwd(), 'src/content/blog', blogFilename),
    'utf-8'
  )
  
  const { data } = matter(source)
  
  // @ts-expect-error
  return {
    slug: blogFilename.replace(/\.mdx$/, ''),
    ...data,
  }
}

export async function getAllBlogs() {
  let blogFileNames = await glob('*.mdx', {
    cwd: './src/content/blog',
  })

  let blogs = await Promise.all(blogFileNames.map(importBlog))

  return blogs.sort((a, z) => {
    const aDate = a.date ? +new Date(a.date) : 0;
    const zDate = z.date ? +new Date(z.date) : 0;
    return zDate - aDate;
  })
}

export async function getBlogBySlug(slug: string): Promise<BlogType | null> {
  try {
    // 移除可能存在的 .mdx 扩展名
    const cleanSlug = slug.replace(/\.mdx$/, '')
    return await importBlog(`${cleanSlug}.mdx`)
  } catch (error) {
    console.error(`Failed to load blog with slug: ${slug}`, error)
    return null
  }
}

// src/lib/blogs.ts (文件末尾)

// 获取所有不重复的标签
export async function getAllTags() {
  const blogs = await getAllBlogs();
  const tagSet = new Set<string>();
  for (const blog of blogs) {
    blog.tags?.forEach(tag => tagSet.add(tag));
  }
  return Array.from(tagSet).sort();
}

// 根据标签名获取对应的所有文章
export async function getBlogsByTag(tag: string): Promise<BlogType[]> {
  const blogs = await getAllBlogs();
  return blogs.filter((blog) => blog.tags && blog.tags.includes(decodeURIComponent(tag)));
}

// 获取所有不重复的分类
export async function getAllCategories() {
  const blogs = await getAllBlogs();
  const categorySet = new Set<string>();
  for (const blog of blogs) {
    if (blog.category) {
      categorySet.add(blog.category);
    }
  }
  return Array.from(categorySet).sort();
}

// 根据分类名获取对应的所有文章
export async function getBlogsByCategory(category: string): Promise<BlogType[]> {
  const blogs = await getAllBlogs();
  return blogs.filter((blog) => blog.category && blog.category === decodeURIComponent(category));
}
*/}

// 2025.07.15.23.45
// src/lib/blogs.ts

import glob from 'fast-glob'
import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type BlogType = {
  title: string
  description: string
  author: string
  date: string
  slug: string
  coverImage?: string
  category?: string
  tags?: string[]
  views?: number
}

async function importBlog(
  blogFilename: string,
): Promise<BlogType> {
  const source = await fs.readFile(
    path.join(process.cwd(), 'src/content/blog', blogFilename),
    'utf-8'
  )
  
  const { data } = matter(source)
  
  // @ts-expect-error
  return {
    slug: blogFilename.replace(/\.mdx$/, ''),
    ...data,
  }
}

export async function getAllBlogs() {
  let blogFileNames = await glob('*.mdx', {
    cwd: './src/content/blog',
  })

  let blogs = await Promise.all(blogFileNames.map(importBlog))

  return blogs.sort((a, z) => {
    const aDate = a.date ? +new Date(a.date) : 0;
    const zDate = z.date ? +new Date(z.date) : 0;
    return zDate - aDate;
  })
}

export async function getBlogBySlug(slug: string): Promise<BlogType | null> {
  try {
    const cleanSlug = slug.replace(/\.mdx$/, '')
    return await importBlog(`${cleanSlug}.mdx`)
  } catch (error) {
    console.error(`Failed to load blog with slug: ${slug}`, error)
    return null
  }
}

// --- 以下是修改后的函数 ---

// 获取所有不重复的标签，并统计每个标签的文章数量
export async function getAllTags() {
  const blogs = await getAllBlogs();
  const tagCountMap = new Map<string, number>();

  for (const blog of blogs) {
    if (blog.tags) {
      for (const tag of blog.tags) {
        tagCountMap.set(tag, (tagCountMap.get(tag) || 0) + 1);
      }
    }
  }

  const sortedTags = Array.from(tagCountMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return sortedTags;
}

// 根据标签名获取对应的所有文章 (此函数保持不变)
export async function getBlogsByTag(tag: string): Promise<BlogType[]> {
  const blogs = await getAllBlogs();
  return blogs.filter((blog) => blog.tags && blog.tags.includes(decodeURIComponent(tag)));
}

// 获取所有不重复的分类，并统计每个分类的文章数量
export async function getAllCategories() {
  const blogs = await getAllBlogs();
  const categoryCountMap = new Map<string, number>();

  for (const blog of blogs) {
    if (blog.category) {
      categoryCountMap.set(blog.category, (categoryCountMap.get(blog.category) || 0) + 1);
    }
  }

  const sortedCategories = Array.from(categoryCountMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return sortedCategories;
}

// 根据分类名获取对应的所有文章 (此函数保持不变)
export async function getBlogsByCategory(category: string): Promise<BlogType[]> {
  const blogs = await getAllBlogs();
  return blogs.filter((blog) => blog.category && blog.category === decodeURIComponent(category));
}

