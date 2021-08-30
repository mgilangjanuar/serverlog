import { Router } from 'express'
import { Endpoint } from '../base/Endpoint'
import { Application } from './Application'
import { Auth } from './Auth'
import { Log } from './Log'

export const API = Router()
  .use(Endpoint.register(Auth, Application, Log))