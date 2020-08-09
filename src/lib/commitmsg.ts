export interface CommitMessage {
  type?: string
  scope?: string
  subject?: string
  body?: string[]
  breaking?: string
  issues?: string[]
}
