import axios, { Method } from 'axios'
import JSCookie from 'js-cookie'

export const fetcher = (url: string, method: Method = 'get', data?: Record<string, any>): Promise<any> => {
  const request = () => axios({
    url: `${process.env.REACT_APP_API_URL || ''}/api/v1${url}`,
    method,
    data,
    withCredentials: true
  }).then(({ data }: any) => data)

  return request()
    .catch(({ response }: any) => {

      if (response?.status === 401 && localStorage.getItem('refresh_token')) {
        axios.post(`${process.env.REACT_APP_API_URL || ''}/api/v1/auth/refreshToken`, {
          refreshToken: localStorage.getItem('refresh_token') })
          .then(({ data }) => {
            JSCookie.set('authorization', data.access_token)
            localStorage.setItem('refresh_token', data.refresh_token as string)
            return request()
          })
      }
    })
}