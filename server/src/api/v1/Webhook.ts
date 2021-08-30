import { AES, enc } from 'crypto-js'
import { Request, Response } from 'express'
import { Logs } from '../../model/Logs'
import { Supabase } from '../../service/Supabase'
import { generateSecret } from '../../utils/Secret'
import { Endpoint } from '../base/Endpoint'

@Endpoint.API()
export class Webhook {

  @Endpoint.POST('/')
  public async log(req: Request, res: Response): Promise<any> {
    const { key } = req.query
    if (!key) {
      throw { status: 400, body: { error: 'key is required' } }
    }
    const { type, log_data: data } = req.body
    if (!data) {
      throw { status: 400, body: { error: 'log_data is required' } }
    }

    const applicationId = JSON.parse(AES.decrypt(decodeURIComponent(key.toString()), Buffer.from(process.env.SECRET).toString('base64')).toString(enc.Utf8))
    await Supabase.build().from<Logs>('logs').delete().lt('created_at', new Date(new Date().getTime() - 172_800_000))
    await Supabase.build().from<Logs>('logs').insert([{
      application_id: applicationId,
      type: type || 'log',
      log_data: AES.encrypt(data, generateSecret(applicationId)).toString()
    }])
    return res.send({ success: true })
  }
}