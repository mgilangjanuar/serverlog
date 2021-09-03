import { Request, Response } from 'express'
import NodeRSA from 'node-rsa'
import { Logs } from '../../model/Logs'
import { Supabase } from '../../service/Supabase'
import { filterQuery } from '../../utils/FilterQuery'
import { Endpoint } from '../base/Endpoint'
import { GetApplication, JWTAuth } from './Middlewares'

@Endpoint.API('/applications/:applicationId/logs')
export class Log {

  @Endpoint.GET('/', { middlewares: [JWTAuth(), GetApplication()] })
  public async find(req: Request, res: Response): Promise<any> {
    if (!req.headers['sl-secret']) {
      throw { status: 403, body: { error: 'Forbidden' } }
    }

    const rsa = new NodeRSA(req.headers['sl-secret'] as string)

    const logs = await filterQuery<Logs[]>(
      Supabase.build().from<Logs>('logs').select('*').eq('application_id', req.application.id),
      req.query)
    return res.send({ logs: logs.map(log => ({
      ...log,
      // log_data: AES.decrypt(log.log_data, generateSecret(req.application.id)).toString(enc.Utf8) })) })
      log_data: rsa.decrypt(log.log_data, 'utf8')
    })) })
  }
}