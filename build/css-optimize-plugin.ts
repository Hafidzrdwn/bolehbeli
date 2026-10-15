import type { Plugin } from 'vite'

export function cssOptimizePlugin(): Plugin {
  return {
    name: 'vite-plugin-css-optimize',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type === 'asset' && file.fileName.endsWith('.css')) {
          const content =
            typeof file.source === 'string'
              ? file.source
              : Buffer.from(file.source).toString('utf-8')

          file.source = content
            .replace(
              /@supports \(color:color-mix\(in lab, red, red\)\){([^{]+{[^}]+})}/g,
              '$1',
            )
            .replace(/@property [^}]+}/g, '')
        }
      }
    },
  }
}
