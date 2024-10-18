import { IncomingMessage } from 'node:http';

export async function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const body: Array<Uint8Array> = [];
    req
      .on('data', (chunk) => {
        body.push(chunk);
      })
      .on('end', () => {
        resolve(Buffer.concat(body).toString());
      })
      .on('error', reject);
  });
}
