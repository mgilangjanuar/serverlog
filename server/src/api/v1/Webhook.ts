import { AES, enc } from 'crypto-js'
import { Request, Response } from 'express'
import { Logs } from '../../model/Logs'
import { Supabase } from '../../service/Supabase'
import { generateSecret } from '../../utils/Secret'
import { Endpoint } from '../base/Endpoint'

@Endpoint.API()
export class Webhook {

  @Endpoint.POST('/:applicationId')
  public async log(req: Request, res: Response): Promise<any> {
    const { type, log_data: data } = req.body
    if (!data) {
      throw { status: 400, body: { error: 'log_data is required' } }
    }

    const applicationId = AES.decrypt(req.params.applicationId, Buffer.from(process.env.SECRET).toString('base64')).toString(enc.Utf8)

    await Supabase.build().from<Logs>('logs').insert([{
      application_id: applicationId,
      type,
      log_data: AES.encrypt(data, generateSecret(applicationId)).toString()
    }])
    return res.send({ success: true })
  }
}