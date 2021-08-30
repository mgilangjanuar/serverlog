import { BaseSchema } from './base/Schema'

export interface Logs extends BaseSchema {
  application_id: string,
  log_data: string,
  type: 'log' | 'error' | 'warn'
}