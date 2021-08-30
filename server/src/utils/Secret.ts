export function generateSecret(uuid: string): string {
  return Buffer.from(`${uuid.split('-').slice(3, 5)}${uuid}${uuid.split('-').slice(0, 2)}${process.env.SECRET}${uuid.split('-')[2]}`).toString('base64')
}