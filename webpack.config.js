import path from 'node:path';
import nodeExternals from 'webpack-node-externals';

export default (_, argv) => {
  const isDev = argv.mode === 'development';

  return {
    entry: './src/index.ts',
    output: {
      filename: 'main.js',
      path: path.resolve(import.meta.dirname, 'dist'),
      module: true,
      chunkFormat: 'module',
      clean: true,
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    experiments: {
      outputModule: true,
    },
    externals: [
      nodeExternals({
        allowlist: isDev ? [] : ['dotenv/config', 'uuid'],
        importType: 'module',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                onlyCompileBundledFiles: true,
              },
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },
    target: 'node',
    devtool: isDev ? 'inline-source-map' : false,
  };
};
