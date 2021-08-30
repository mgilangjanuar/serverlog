import { Request, Response } from 'express'
import { Logs } from '../../model/Logs'
import { Supabase } from '../../service/Supabase'
import { filterQuery } from '../../utils/FilterQuery'
import { Endpoint } from '../base/Endpoint'
import { GetApplication, JWTAuth } from './Middlewares'

@Endpoint.API('/applications/:applicationId/logs')
export class Log {

  @Endpoint.GET('/', { middlewares: [JWTAuth(), GetApplication()] })
  public async find(req: Request, res: Response): Promise<any> {
    const logs = await filterQuery<Logs>(
      Supabase.build().from<Logs>('logs').select('*').eq('application_id', req.application.id),
      req.query)
    return res.send({ logs })
  }
}