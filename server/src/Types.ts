import { User } from '@supabase/gotrue-js'
import { Applications } from './model/Applications'

declare module 'http' {
  interface IncomingMessage {
    user?: User,
    application?: Applications
  }
}