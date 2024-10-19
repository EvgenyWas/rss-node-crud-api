import cluster from 'node:cluster';
import http from 'node:http';
import 'dotenv/config';

import { createLoadBalancer } from './loadBalancer';
import { messages } from './messages';
import router from './router';
import { createServer } from './server';
import { createError } from './utils';

const PORT = process.env.PORT || 4000;

if (process.env.MULTI === 'true') {
  if (cluster.isPrimary) {
    createLoadBalancer();
  } else {
    http
      .createServer((req, res) => {
        if (req.headers['x-forwarded-for'] !== process.env.WORKER_ID) {
          return createError(res, { code: 403, message: messages.forbidden });
        }

        res.setHeader('X-Processed-By', process.env.WORKER_IDX ?? '');
        res.setHeader('Content-Type', 'application/json');
        router.use(req, res);
      })
      .listen(process.env.WORKER_PORT, () => {
        console.log(
          `Worker process ${process.pid} is listening on port ${process.env.WORKER_PORT}`,
        );
      });
  }
} else {
  createServer().listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}
