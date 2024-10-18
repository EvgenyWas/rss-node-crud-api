import http from 'node:http';

import router from './router';

export const createServer = () => {
  http
    .createServer((req, res) => {
      res.setHeader('Content-Type', 'application/json');
      router.use(req, res);
    })
    .listen(process.env.PORT);
};
