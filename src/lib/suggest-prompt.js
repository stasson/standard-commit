const { StringPrompt } = require('enquirer')

module.exports = class SuggestPrompt extends StringPrompt {
  constructor(options) {
    super(options)
    this.suggestionIndex = 0
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

// const prompt = new SuggestPrompt({
//   message: 'What is your username?',
//   suggestions: ['suggestion1', 'suggestion2', 'suggestion3']
// })

// prompt
//   .run()
//   .then(answer => console.log('ANSWER:', answer))
//   .catch(console.log)
