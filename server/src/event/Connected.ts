import { Socket } from 'socket.io'

export async function connected(socket: Socket): Promise<void> {
  const _userId = socket['uuid']
}