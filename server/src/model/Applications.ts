import { BaseSchema } from './base/Schema'

export interface Applications extends BaseSchema {
  name: string,
  url: string,
  description?: string,
  uids: string[]
}