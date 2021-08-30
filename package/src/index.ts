import axios from 'axios'
import axiosRetry from 'axios-retry'
import { serializeError } from 'serialize-error'

export class ServerLog {
  private static BASE_URL = 'https://serverlog.vercel.app/api/v1/webhook'
  private static APP_ID: string

  public static init(appId: string): void {
    this.APP_ID = appId
  }

  public static async log(...data: any[]): Promise<void> {
    return await this._log('log', data)
  }

  public static async error(...data: any[]): Promise<void> {
    return await this._log('error', data)
  }

  public static async warn(...data: any[]): Promise<void> {
    return await this._log('warn', data)
  }

  private static async _log(type: string, ...data: any[]): Promise<void> {
    if (this.APP_ID) {
      axiosRetry(axios, {
        retries: 10,
        retryDelay: () => 5_000,
        shouldResetTimeout: true
      })
      await axios.post(`${this.BASE_URL}/${this.APP_ID}`, {
        type,
        log_data: data.map(datum => {
          let result = datum
          if (typeof datum === 'object') {
            result = JSON.stringify(serializeError(datum), null, 2)
          }
          return result
        }).join(' ')
      })
    }
  }
}