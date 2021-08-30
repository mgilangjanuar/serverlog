import { Request, Response } from 'express'
import { Logs } from '../../model/Logs'
import { Supabase } from '../../service/Supabase'
import { Endpoint } from '../base/Endpoint'

@Endpoint.API()
export class Webhook {

  @Endpoint.POST('/:applicationId')
  public async log(req: Request, res: Response): Promise<any> {
    const { log_data: data } = req.body
    if (!data) {
      throw { status: 400, body: { error: 'log_data is required' } }
    }
    await Supabase.build().from<Logs>('logs').insert([{
      application_id: req.params.applicationId,
      log_data: data
    }])
    return res.send({ success: true })
  }
}