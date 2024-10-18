import cluster from 'node:cluster';
import http from 'node:http';
import os from 'node:os';
import { v4 as uuid } from 'uuid';

export const createLoadBalancer = () => {
  const port = Number(process.env.PORT) || 4000;
  const parallelism = os.availableParallelism();
  const workers: Array<{ id: string; pid: number; port: number }> = [];
  let currentWorkerIdx = 0;

  for (let i = 1; i <= parallelism; i++) {
    const id = uuid();
    const worker = cluster.fork({
      WORKER_PORT: port + i,
      WORKER_ID: id,
      WORKER_IDX: i - 1,
    });
    workers.push({
      id,
      pid: worker.process.pid ?? worker.id,
      port: port + i,
    });
  }

  http
    .createServer((req, res) => {
      const worker = workers[currentWorkerIdx];
      currentWorkerIdx = (currentWorkerIdx + 1) % workers.length;

      const proxyReq = http.request(
        {
          hostname: 'localhost',
          port: worker.port,
          path: req.url,
          method: req.method,
          headers: { ...req.headers, 'x-forwarded-for': worker.id },
        },
        (proxyRes) => {
          res.writeHead(proxyRes.statusCode!, proxyRes.headers);
          proxyRes.pipe(res);
        },
      );

      req.pipe(proxyReq);
    })
    .listen(port, () => {
      console.log(`Load balancer is listening on port ${port}`);
    });

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
};
