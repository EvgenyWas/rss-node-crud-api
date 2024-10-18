import http from 'node:http';

import router from './router';

const PORT = process.env.PORT || 4000;

export const createServer = () => {
  http
    .createServer((req, res) => {
      res.setHeader('Content-Type', 'application/json');
      router.use(req, res);
    })
    .listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
};
