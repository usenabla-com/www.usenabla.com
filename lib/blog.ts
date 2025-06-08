import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'app/blog/content')

export interface BlogPost {
  id: string
  title: string
  summary: string
  author: string
  published: string
  image: string
  tags: string[]
  content: string
  url: string
}

export async function getAllPosts(): Promise<BlogPost[]> {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  
  const allPostsData = await Promise.all(
    fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(async (fileName) => {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '')

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents)

        // Use remark to convert markdown into HTML string
        const processedContent = await remark()
          .use(html)
          .process(matterResult.content)
        const content = processedContent.toString()

        // Combine the data with the id and content
        return {
          id,
          content,
          url: `/blog/${id}`,
          title: matterResult.data.title || '',
          summary: matterResult.data.summary || '',
          author: matterResult.data.author || '',
          published: matterResult.data.published || '',
          image: matterResult.data.image || '/images/block/placeholder-dark-1.svg',
          tags: matterResult.data.tags || [],
        } as BlogPost
      })
  )

  // Sort posts by date (most recent first)
  return allPostsData.sort((a, b) => {
    const dateA = new Date(a.published)
    const dateB = new Date(b.published)
    return dateB.getTime() - dateA.getTime()
  })
}

export async function getPostData(id: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content)
    const content = processedContent.toString()

    // Combine the data with the id and content
    return {
      id,
      content,
      url: `/blog/${id}`,
      title: matterResult.data.title || '',
      summary: matterResult.data.summary || '',
      author: matterResult.data.author || '',
      published: matterResult.data.published || '',
      image: matterResult.data.image || '/images/block/placeholder-dark-1.svg',
      tags: matterResult.data.tags || [],
    } as BlogPost
  } catch (error) {
    console.error('Error reading post:', error)
    return null
  }
} 