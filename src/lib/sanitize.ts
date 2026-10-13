import { TITLE_MAX_LENGTH } from '@/lib/constants'

const ZERO_WIDTH_REGEX = /[\u200B-\u200D\uFEFF]/g
const BIDI_OVERRIDE_REGEX = /[\u202A-\u202E\u2066-\u2069]/g
const CONTROL_CHARS_REGEX = /\p{Cc}/gu
const MULTI_SPACE_REGEX = /\s+/g

export function sanitizeTitle(raw: string): string {
  if (typeof raw !== 'string') return ''

  return raw
    .normalize('NFKC')
    .replace(CONTROL_CHARS_REGEX, '')
    .replace(ZERO_WIDTH_REGEX, '')
    .replace(BIDI_OVERRIDE_REGEX, '')
    .replace(MULTI_SPACE_REGEX, ' ')
    .trim()
    .slice(0, TITLE_MAX_LENGTH)
}
