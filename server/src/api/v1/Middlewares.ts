import { NextFunction, Request, RequestHandler, Response } from 'express'
import { Applications } from '../../model/Applications'
import { Supabase } from '../../Service/Supabase'

export function JWTAuth(): RequestHandler {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      const token = (req.headers?.authorization || req.cookies?.authorization)?.replace(/^Bearer\ /gi, '')
      if (!token) throw new Error()

      const { user, error } = await Supabase.build().auth.api.getUser(token)
      if (error) throw new Error(error.message)

      req.user = user

      return next()
    } catch (error) {
      console.error(error)
      throw {
        status: 401,
        body: {
          error: 'Unauthorized',
          ...error.message ? { details: error.message } : {}
        }
      }
    }
  }
}

export function GetApplication(): RequestHandler {
  return async (req: Request, _: Response, next: NextFunction) => {
    if (req.params.applicationId) {
      const { data: application } = await Supabase.build().from<Applications>('applications').select('*').eq('id', req.params.applicationId).single()
      req.application = application
    }
    return next()
  }
}