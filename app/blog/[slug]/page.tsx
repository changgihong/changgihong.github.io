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
      {post.revisions.length > 0 && (
        <details className="not-prose mb-8 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900">
          <summary className="cursor-pointer font-medium text-zinc-800 dark:text-zinc-200">
            수정 내역
          </summary>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-zinc-600 dark:text-zinc-300">
            {post.revisions.map((revision) => (
              <li key={revision}>{revision}</li>
            ))}
          </ul>
        </details>
      )}
      <MDXContent code={post.body} />
    </article>
  )
}
