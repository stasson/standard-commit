import { StringPrompt } from 'enquirer'

export default class SuggestPrompt extends StringPrompt {
  suggestionIndex = 0
  suggestions: any

  constructor(options) {
    super(options)
    this.suggest()
  }

  suggest() {
    this.initial = this.suggestions && this.suggestions[this.suggestionIndex]
    this.input = this.initial
    this.cursor = this.input.length
    this.render()
  }

  suggestNext() {
    this.suggestionIndex = (this.suggestionIndex + 1) % this.suggestions.length
    this.suggest()
  }

  suggestPrev() {
    this.suggestionIndex =
      (this.suggestionIndex - 1 + this.suggestions.length) %
      this.suggestions.length
    this.suggest()
  }

  next() {
    if ((this.cursor = this.input.length)) {
      this.suggestNext()
    } else this.completion()
  }

  completion() {
    this.input = this.initial
    this.cursor = this.input.length
    return this.render()
  }

  up() {
    this.suggestPrev()
  }
  down() {
    this.suggestNext()
  }
}

declare module 'enquirer' {
  class StringPrompt {
    constructor(...args: any[])

    initial: string
    input: string
    cursor: number

    alert(...args: any[]): void

    body(...args: any[]): void

    cancel(...args: any[]): void

    clear(...args: any[]): void

    close(...args: any[]): void

    cursorHide(...args: any[]): void

    cursorShow(...args: any[]): void

    element(...args: any[]): void

    error(...args: any[]): void

    footer(...args: any[]): void

    format(...args: any[]): void

    header(...args: any[]): void

    hint(...args: any[]): void

    indicator(...args: any[]): void

    initialize(...args: any[]): void

    isValue(...args: any[]): void

    keypress(...args: any[]): void

    message(...args: any[]): void

    pointer(...args: any[]): void

    prefix(...args: any[]): void

    render(...args: any[]): void

    resolve(...args: any[]): void

    restore(...args: any[]): void

    result(...args: any[]): void

    run(...args: any[]): void

    sections(...args: any[]): void

    separator(...args: any[]): void

    skip(...args: any[]): void

    start(...args: any[]): void

    submit(...args: any[]): void

    validate(...args: any[]): void

    write(...args: any[]): void

    append(...args: any[]): void

    backward(...args: any[]): void

    cutForward(...args: any[]): void

    cutLeft(...args: any[]): void

    delete(...args: any[]): void

    deleteForward(...args: any[]): void

    dispatch(...args: any[]): void

    first(...args: any[]): void

    format(...args: any[]): void

    forward(...args: any[]): void

    insert(...args: any[]): void

    isValue(...args: any[]): void

    keypress(...args: any[]): void

    last(...args: any[]): void

    left(...args: any[]): void

    moveCursor(...args: any[]): void

    next(...args: any[]): void

    paste(...args: any[]): void

    prev(...args: any[]): void

    render(...args: any[]): void

    reset(...args: any[]): void

    right(...args: any[]): void

    toggleCursor(...args: any[]): void
  }
}
