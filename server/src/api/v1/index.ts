import { Router } from 'express'
import { Endpoint } from '../base/Endpoint'
import { Application } from './Application'
import { Auth } from './Auth'
import { Log } from './Log'
import { Webhook } from './Webhook'

export const API = Router()
  .use(Endpoint.register(Auth, Application, Log, Webhook))