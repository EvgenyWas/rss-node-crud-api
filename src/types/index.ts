import { IncomingMessage, ServerResponse } from 'node:http';

export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: Array<string>;
}

export type UserPayload = Omit<User, 'id'>;

export interface ErrorParams {
  code: number;
  message: string;
  stack?: string;
}

export type RequestParams = Record<string, string>;

export interface ControllerArgs {
  req: IncomingMessage;
  res: ServerResponse;
  params: RequestParams;
}

export type Controller = (args: ControllerArgs) => void | Promise<void>;

export type RouterMethods = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type Routes = Record<string, Controller>;
