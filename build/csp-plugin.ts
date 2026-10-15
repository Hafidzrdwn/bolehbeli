import type { Plugin } from 'vite'

const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
]

export function cspPlugin(): Plugin {
  return {
    name: 'vite-plugin-csp',
    apply: 'build',
    transformIndexHtml(html) {
      return {
        html: html.replace(/>\s+</g, '><').trim(),
        tags: [
          {
            tag: 'meta',
            attrs: {
              'http-equiv': 'Content-Security-Policy',
              content: CSP_DIRECTIVES.join('; '),
            },
            injectTo: 'head-prepend',
          },
        ],
      }
    },
  }
}
