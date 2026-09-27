import { useMDXComponents as getMDXComponents } from '@/mdx-components'
import type { ComponentType } from 'react'
import { cache } from 'react'
import * as runtime from 'react/jsx-runtime'

const sharedComponents = getMDXComponents({})

const getMDXComponent = cache((code: string) => {
  const fn = new Function(code)
  return fn({ ...runtime }).default
})

type MDXComponentsMap = Record<string, ComponentType>

type MDXContentProps = {
  code: string
  components?: MDXComponentsMap
}

export function MDXContent({ code, components }: MDXContentProps) {
  const Component = getMDXComponent(code)
  // MDX is compiled from content and cached within this server render.
  // eslint-disable-next-line react-hooks/static-components
  return <Component components={{ ...sharedComponents, ...components }} />
}
