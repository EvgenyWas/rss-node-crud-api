import { ServerResponse } from 'node:http';

import { ErrorParams } from '../types';

export function createError(res: ServerResponse, params: ErrorParams) {
  res.writeHead(params.code).end(JSON.stringify(params));
}
