import { MDXContent } from '@/components/mdx-content'
import {
  findPublishedBlogPostBySlug,
  getPublishedBlogPosts,
  normalizeBlogSlug,
} from '@/lib/blog'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type BlogPostPageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return getPublishedBlogPosts().map((post) => ({
    slug: normalizeBlogSlug(post.slug),
  }))
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = findPublishedBlogPostBySlug(slug)

  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = findPublishedBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <article>
      <header className="not-prose mb-8 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          작성 <time dateTime={post.date}>{post.date}</time>
          {post.updatedAt && (
            <>
              {' · 수정 '}
              <time dateTime={post.updatedAt}>{post.updatedAt}</time>
            </>
          )}
        </p>
        {post.description && (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            {post.description}
          </p>
        )}
      </header>
      <MDXContent code={post.body} />
    </article>
  )
}
