import { Request, Response } from 'express'
import { Applications } from '../../model/Applications'
import { Supabase } from '../../service/Supabase'
import { filterQuery } from '../../utils/FilterQuery'
import { Endpoint } from '../base/Endpoint'
import { JWTAuth } from './Middlewares'
import { AES } from 'crypto-js'

@Endpoint.API('/applications')
export class Application {

  @Endpoint.GET('/', { middlewares: [JWTAuth()] })
  public async find(req: Request, res: Response): Promise<any> {
    const applications = await filterQuery<Applications>(
      Supabase.build().from<Applications>('applications').select('*').contains('uids', [req.user.id]),
      req.query)
    return res.send({ applications })
  }

  @Endpoint.POST('/', { middlewares: [JWTAuth()] })
  public async create(req: Request, res: Response): Promise<any> {
    const { application: data } = req.body
    if (!data) {
      throw { status: 400, body: { error: '`application` in body is required' } }
    }
    if ((await Supabase.build().from<Applications>('applications').select('id').contains('uids', [req.user.id])).count > 10) {
      throw { status: 400, body: { error: 'You reach the limit' } }
    }

    const { data: application } = await Supabase.build().from<Applications>('applications').insert([
      {
        ...data,
        uids: [req.user.id]
      }
    ]).single()
    return res.send({ application })
  }

  @Endpoint.PATCH('/:id', { middlewares: [JWTAuth()] })
  public async update(req: Request, res: Response): Promise<any> {
    const { id } = req.params
    const { application: data } = req.body
    if (!data) {
      throw { status: 400, body: { error: '`application` in body is required' } }
    }

    const { data: application } = await Supabase.build().from<Applications>('applications').update({
      ...data,
      ...data.uids ? { uids: [...new Set(data.uids)].map(uid => uid.toString().trim()) } : {}
    }).eq('id', id).single()
    if (!application) {
      throw { status: 404, body: { error: 'Application not found' } }
    }
    return res.send({ application })
  }

  @Endpoint.GET('/:id', { middlewares: [JWTAuth()] })
  public async retrieve(req: Request, res: Response): Promise<any> {
    const { id } = req.params
    const { data: application } = await Supabase.build().from<Applications>('applications').select('*').eq('id', id).single()
    if (!application) {
      throw { status: 404, body: { error: 'Application not found' } }
    }
    return res.send({ application,
      key: AES.encrypt(application.id, Buffer.from(process.env.SECRET).toString('base64')).toString() })
  }

  @Endpoint.DELETE('/:id', { middlewares: [JWTAuth()] })
  public async remove(req: Request, res: Response): Promise<any> {
    const { id } = req.params
    const { data: application } = await Supabase.build().from<Applications>('applications').delete().eq('id', id).single()
    if (!application) {
      throw { status: 404, body: { error: 'Application not found' } }
    }
    return res.send({ application })
  }
}