import { v4 as uuid } from 'uuid';

import { UsersModel } from '../models';
import { ControllerArgs } from '../types';
import {
  createError,
  iseValidUser,
  isValidUserPayload,
  isValidUUID,
  readBody,
} from '../utils';
import { messages } from '../messages';

export default class UsersController {
  static getUsers({ res }: ControllerArgs) {
    res.end(JSON.stringify(Array.from(UsersModel.values())));
  }

  static getUserByID({ res, params }: ControllerArgs) {
    if (!isValidUUID(params.id)) {
      return createError(res, { code: 400, message: messages.invalidUserID });
    }

    if (!UsersModel.has(params.id)) {
      return createError(res, { code: 404, message: messages.userNotFound });
    }

    res.end(JSON.stringify(UsersModel.get(params.id)));
  }

  static async postUser({ req, res }: ControllerArgs) {
    let payload;
    try {
      const body = await readBody(req);
      payload = JSON.parse(body);
    } catch (error) {
      return createError(res, { code: 400, message: messages.invalidPayload });
    }

    if (!isValidUserPayload(payload)) {
      return createError(res, {
        code: 400,
        message: messages.invalidPayloadFields,
      });
    }

    const { username, age, hobbies } = payload;
    const user = { id: uuid(), username, age, hobbies };
    UsersModel.set(user.id, user);
    res.writeHead(201).end(JSON.stringify(user));
  }

  static async putUser({ req, res, params }: ControllerArgs) {
    if (!isValidUUID(params.id)) {
      return createError(res, { code: 400, message: messages.invalidUserID });
    }

    if (!UsersModel.has(params.id)) {
      return createError(res, { code: 404, message: messages.userNotFound });
    }

    let payload;
    try {
      const body = await readBody(req);
      payload = JSON.parse(body);
    } catch (error) {
      return createError(res, { code: 400, message: messages.invalidPayload });
    }

    if (!iseValidUser(payload)) {
      return createError(res, {
        code: 400,
        message: messages.invalidPayloadFields,
      });
    }

    const { username, age, hobbies } = payload;
    const user = { id: params.id, username, age, hobbies };
    UsersModel.set(params.id, user);
    res.end(JSON.stringify(user));
  }

  static deleteUser({ res, params }: ControllerArgs) {
    if (!isValidUUID(params.id)) {
      return createError(res, { code: 400, message: messages.invalidUserID });
    }

    if (!UsersModel.has(params.id)) {
      return createError(res, { code: 404, message: messages.userNotFound });
    }

    UsersModel.delete(params.id);
    res.removeHeader('Content-Type');
    res.writeHead(204).end();
  }
}
