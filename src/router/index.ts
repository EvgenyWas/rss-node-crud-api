import { IncomingMessage, ServerResponse } from 'node:http';

import { UsersController } from '../controllers';
import { createError, getRoute, removeTrailingSlash } from '../utils';
import { Controller, RequestParams, RouterMethods, Routes } from '../types';
import { messages } from '../messages';

class Router {
  private _base: string;
  private _routes: Record<RouterMethods, Routes>;

  constructor(base: string = '') {
    this._base = base;
    this._routes = {
      GET: {},
      POST: {},
      PUT: {},
      DELETE: {},
    };
  }

  get(route: string, controller: Controller) {
    this._routes.GET[getRoute(this._base, route)] = controller;
  }

  post(route: string, controller: Controller) {
    this._routes.POST[getRoute(this._base, route)] = controller;
  }

  put(route: string, controller: Controller) {
    this._routes.PUT[getRoute(this._base, route)] = controller;
  }

  delete(route: string, controller: Controller) {
    this._routes.DELETE[getRoute(this._base, route)] = controller;
  }

  async use(req: IncomingMessage, res: ServerResponse) {
    const methodRoutes = this._routes[req.method as RouterMethods];
    if (!methodRoutes) {
      return createError(res, { code: 404, message: messages.unknownEndpoint });
    }

    try {
      for (const route in methodRoutes) {
        const { params, matched } = this.matchRoute(req.url ?? '', route);

        if (matched) {
          return await methodRoutes[route]({ req, res, params });
        }
      }
    } catch (error) {
      console.log(error);
      return createError(res, {
        code: 500,
        message: messages.internalServerError,
      });
    }

    createError(res, { code: 404, message: messages.badRequest });
  }

  matchRoute(
    fullPath: string,
    route: string,
  ): { params: RequestParams; matched: boolean } {
    const routeParts = route.split('/');
    const urlParts = removeTrailingSlash(fullPath).split('/');

    if (routeParts.length !== urlParts.length) {
      return { params: {}, matched: false };
    }

    const params: RequestParams = {};
    const matched = routeParts.every((part, index) => {
      if (part === urlParts[index]) {
        return true;
      }

      if (part.startsWith(':')) {
        params[part.slice(1)] = urlParts[index];

        return true;
      }

      return false;
    });

    return matched ? { params, matched: true } : { params: {}, matched: false };
  }
}

const router = new Router(process.env.BASE_PATH);
router.get('/users', UsersController.getUsers);
router.get('/users/:id', UsersController.getUserByID);
router.post('/users', UsersController.postUser);
router.put('/users/:id', UsersController.putUser);
router.delete('/users/:id', UsersController.deleteUser);

export default router;
