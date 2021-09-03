import { AES, enc } from 'crypto-js'
import { Request, Response } from 'express'
import NodeRSA from 'node-rsa'
import { Applications } from '../../model/Applications'
import { Logs } from '../../model/Logs'
import { Supabase } from '../../service/Supabase'
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
    const { data: application } = await Supabase.build().from<Applications>('applications').select('*').eq('id', applicationId).single()

    // Delete all logs < 12 hours
    Supabase.build().from<Logs>('logs').delete().lt('created_at', new Date(new Date().getTime() - 43_200_000).toISOString())

    const rsa = new NodeRSA()
    rsa.importKey(application.public_key, 'public')
    await Supabase.build().from<Logs>('logs').insert([{
      application_id: applicationId,
      type: type || 'log',
      log_data: rsa.encrypt(data, 'base64')
    }])
    return res.send({ success: true })
  }
}