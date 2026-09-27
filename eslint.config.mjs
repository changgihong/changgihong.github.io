import { globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import { flat as mdxConfig } from 'eslint-plugin-mdx'

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  prettierRecommended,
  { ...mdxConfig, files: ['**/*.mdx'] },
  globalIgnores(['.velite/**']),
  {
    files: ['**/*.mdx'],
    rules: {
      'prettier/prettier': 'off',
    },
  },
]

export default eslintConfig
