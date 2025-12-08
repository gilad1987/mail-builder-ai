declare module 'mjml-browser' {
  interface MJMLParseResults {
    html: string
    errors: Array<{
      line: number
      message: string
      tagName: string
      formattedMessage: string
    }>
  }

  interface MJMLOptions {
    fonts?: Record<string, string>
    keepComments?: boolean
    beautify?: boolean
    minify?: boolean
    validationLevel?: 'strict' | 'soft' | 'skip'
  }

  export default function mjml2html(mjml: string, options?: MJMLOptions): MJMLParseResults
}
