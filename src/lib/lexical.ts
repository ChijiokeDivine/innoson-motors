export interface LexicalNode {
  type?: string
  text?: string
  children?: LexicalNode[]
  format?: number
  mode?: string
  detail?: number
  direction?: string | null
  style?: string
  indent?: number
  version?: number
}

export interface LexicalRoot {
  root: LexicalNode
}

export function plainTextToLexical(text: string | null | undefined): LexicalRoot {
  if (!text) {
    return {
      root: {
        type: 'root',
        children: [],
        direction: null,
        format: 0,
        indent: 0,
        version: 1,
      } as LexicalNode,
    }
  }

  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)

  const children: LexicalNode[] =
    paragraphs.length === 0
      ? [
          {
            type: 'paragraph',
            children: [{ type: 'text', text, detail: 0, format: 0, mode: 'normal', style: '' }],
            direction: 'ltr',
            format: 0,
            indent: 0,
            version: 1,
          },
        ]
      : paragraphs.map((p) => ({
          type: 'paragraph',
          children: p
            .split('\n')
            .flatMap<LexicalNode>((line, idx, arr) => [
              {
                type: 'text',
                text: line,
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
              },
              ...(idx < arr.length - 1
                ? [{ type: 'linebreak', direction: null, format: 0, indent: 0, version: 1 }]
                : []),
            ]),
          direction: 'ltr',
          format: 0,
          indent: 0,
          version: 1,
        }))

  return {
    root: {
      type: 'root',
      children,
      direction: null,
      format: 0,
      indent: 0,
      version: 1,
    },
  }
}

export function htmlStripToText(htmlish: string): string {
  return htmlish
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2028/g, '\n')
    .trim()
}
