import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const siteUrl = 'https://changgihong.github.io'
const siteName = "Changgi Hong's Blog"
const siteDescription = '개발 관련 시행착오, 고민, 생각을 기록하는 공간입니다.'
const loadCollection = (name) =>
  JSON.parse(
    readFileSync(new URL(`../.velite/${name}.json`, import.meta.url), 'utf8'),
  )

// Inspect static HTML, including entity decoding, as a crawler without JavaScript.
function decodeEntities(value) {
  const named = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' }
  return value.replace(
    /&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi,
    (_, entity) => {
      if (entity.startsWith('#')) {
        const hex = entity[1].toLowerCase() === 'x'
        return String.fromCodePoint(
          parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10),
        )
      }
      return named[entity.toLowerCase()]
    },
  )
}
function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [
      key,
      decodeEntities(value),
    ]),
  )
}
function inspectPage(path) {
  const file = path === '/' ? 'index' : path.slice(1)
  const html = readFileSync(
    new URL(`../out/${file}.html`, import.meta.url),
    'utf8',
  )
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1]
  assert.ok(head, `${path}: metadata must be in the initial HTML head`)
  const meta = [...head.matchAll(/<meta\b[^>]*>/g)].map(([tag]) =>
    attributes(tag),
  )
  const links = [...head.matchAll(/<link\b[^>]*>/g)].map(([tag]) =>
    attributes(tag),
  )
  return {
    title: decodeEntities(head.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ''),
    meta(key) {
      const matches = meta.filter(
        (item) => item.property === key || item.name === key,
      )
      assert.equal(matches.length, 1, `${path}: exactly one ${key} tag`)
      return matches[0].content
    },
    canonical() {
      const matches = links.filter((item) => item.rel === 'canonical')
      assert.equal(matches.length, 1, `${path}: exactly one canonical link`)
      return matches[0].href
    },
  }
}

const pages = [
  { path: '/', title: siteName, description: siteDescription, type: 'website' },
  {
    path: '/blog',
    title: '블로그',
    description: '홍창기의 개발 블로그 글 목록입니다.',
    type: 'website',
  },
  {
    path: '/wiki',
    title: 'Wiki',
    description: '공부 노트와 연결된 문서 목록입니다.',
    type: 'website',
  },
  {
    path: '/books',
    title: 'Books',
    description: '읽은 책과 서평을 기록한 목록입니다.',
    type: 'website',
  },
  ...loadCollection('blog')
    .filter((post) => !post.draft)
    .map((post) => ({
      path: `/blog/${post.slug.replace(/^blog\//, '')}`,
      title: post.title,
      description: post.description?.trim() || siteDescription,
      type: 'article',
    })),
  ...loadCollection('wiki').map((post) => ({
    path: `/${post.slug}`,
    title: post.title,
    description: post.description?.trim() || siteDescription,
    type: 'article',
  })),
  ...loadCollection('books').map((book) => ({
    path: `/books/${book.slug}`,
    title: book.title,
    description: book.summary,
    type: 'article',
  })),
]

for (const { path, title, description, type } of pages) {
  test(`${path}: page-specific metadata in static HTML`, () => {
    const page = inspectPage(path)
    const url = new URL(path, siteUrl).href
    assert.equal(page.title, path === '/' ? title : `${title} | Changgi Hong`)
    assert.equal(page.meta('description'), description)
    assert.equal(page.meta('og:title'), title)
    assert.equal(page.meta('og:description'), description)
    assert.equal(new URL(page.meta('og:url')).href, url)
    assert.equal(page.meta('og:type'), type)
    assert.equal(page.meta('og:site_name'), siteName)
    assert.equal(new URL(page.canonical()).href, url)
    assert.equal(page.meta('twitter:title'), title)
    assert.equal(page.meta('twitter:description'), description)
    assert.equal(page.meta('twitter:card'), 'summary_large_image')
    assert.equal(page.meta('og:image'), `${siteUrl}/og-card.png`)
    assert.equal(page.meta('og:image:width'), '640')
    assert.equal(page.meta('og:image:height'), '335')
    assert.equal(page.meta('twitter:image'), `${siteUrl}/og-card.png`)
  })
}
