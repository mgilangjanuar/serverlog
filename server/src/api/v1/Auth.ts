import { Request, Response } from 'express'
import { Supabase } from '../../service/Supabase'
import { Endpoint } from '../base/Endpoint'
import { JWTAuth } from './Middlewares'

@Endpoint.API()
export class Auth {

  @Endpoint.GET()
  public async urls(_: Request, res: Response): Promise<any> {
    const { url: google } = await Supabase.build().auth.signIn({ provider: 'google' }, process.env.REDIRECT_URL ? { redirectTo: process.env.REDIRECT_URL } : {})
    const { url: github } = await Supabase.build().auth.signIn({ provider: 'github' }, process.env.REDIRECT_URL ? { redirectTo: process.env.REDIRECT_URL } : {})
    return res.send({ google, github })
  }

  @Endpoint.GET({ middlewares: [JWTAuth()] })
  public async me(req: Request, res: Response): Promise<any> {
    return res.send({ user: req.user })
  }
}