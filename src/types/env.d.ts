declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PWD: string;
      PORT: string;
      BASE_PATH: string;
      MULTI: string;
    }
  }
}

export {};
