import { BaseSchema } from './base/Schema'

export interface Applications extends BaseSchema {
  name: string,
  public_key: string,
  url?: string,
  description?: string,
  uids: string[]
}