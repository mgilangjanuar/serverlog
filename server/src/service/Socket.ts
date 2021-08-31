import { Server } from 'http'
import { Server as SocketServer } from 'socket.io'

export class Socket {

  private static instance: Socket

  private io: SocketServer

  private constructor(httpServer: Server) {
    this.io = new SocketServer(httpServer)
    this.io.use((socket, next) => {
      if (socket.handshake.query?.uuid) {
        socket['uuid'] = socket.handshake.query.uuid
        return next()
      }
      return next(new Error('UUID is required in query'))
    })
  }

  public static init(httpServer: Server): Socket {
    if (!Socket.instance) {
      Socket.instance = new Socket(httpServer)
    }
    return Socket.instance
  }

  public static get io(): SocketServer {
    return Socket.instance.io
  }
}