import { SITE_DESCRIPTION, SITE_NAME } from '@/constants/common'
import type { Metadata } from 'next'

type PageMetadataOptions = {
  title: string
  description?: string
  path: string
  type?: 'website' | 'article'
}

export function createPageMetadata({
  title,
  description,
  path,
  type = 'website',
}: PageMetadataOptions): Metadata {
  const resolvedDescription = description?.trim() || SITE_DESCRIPTION

  return {
    title,
    description: resolvedDescription,
    alternates: { canonical: path },
    openGraph: {
      type,
      title,
      description: resolvedDescription,
      url: path,
      siteName: SITE_NAME,
      images: [
        { url: '/og-card.png', width: 640, height: 335, alt: SITE_NAME },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: resolvedDescription,
      images: ['/og-card.png'],
    },
  }
}
