import axios, { Method } from 'axios'
import JSCookie from 'js-cookie'

export const fetcher = async (url: string, method: Method = 'get', data?: Record<string, any>): Promise<any> => {
  const request = async () => await axios({
    url: `${process.env.REACT_APP_API_URL || ''}/api/v1${url}`,
    method,
    data,
    withCredentials: true
  })

  try {
    return (await request())?.data
  } catch (error) {
    const { response } = error as any
    if (response?.status === 401 && localStorage.getItem('refresh_token')) {
      try {
        const { data } = await axios.post(`${process.env.REACT_APP_API_URL || ''}/api/v1/auth/refreshToken`, {
          refreshToken: localStorage.getItem('refresh_token') })
        JSCookie.set('authorization', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token as string)
        return (await request())?.data
      } catch (error) {
        throw response
      }
    }
    throw response
  }
}