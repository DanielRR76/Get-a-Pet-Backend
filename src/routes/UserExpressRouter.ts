import UserController from '@controllers/UserController';
import { HttpMethod } from '@enums/HttpMethod';
import { Router } from '@contracts/Router';
import { MulterMiddleware } from '../middlewares/MulterMiddleware';
import { ExpressTokenMiddleware } from '@middlewares/ExpressTokenMiddleware';

export class UserExpressRouter extends Router {
    private controller: UserController;
    private multerMiddleware: MulterMiddleware;
    private expressTokenMiddleware: ExpressTokenMiddleware;
    constructor(controller: UserController, multerMiddleware: MulterMiddleware, expressTokenMiddleware: ExpressTokenMiddleware) {
        super();
        this.controller = controller;
        this.multerMiddleware = multerMiddleware;
        this.expressTokenMiddleware = expressTokenMiddleware;
        this.addRoute({
            method: HttpMethod.POST,
            path: '/register',
            middleware: [],
            handler: this.controller.register,
        });
        this.addRoute({
            method: HttpMethod.POST,
            path: '/login',
            middleware: [],
            handler: this.controller.login,
        });
        this.addRoute({
            method: HttpMethod.GET,
            path: '/checkuser',
            middleware: [this.expressTokenMiddleware.verifyToken],
            handler: this.controller.checkUser,
        });
        this.addRoute({
            method: HttpMethod.GET,
            path: '/:id',
            middleware: [],
            handler: this.controller.getUserById,
        });
        this.addRoute({
            method: HttpMethod.PATCH,
            path: '/edit',
            middleware: [this.expressTokenMiddleware.verifyToken, this.multerMiddleware.upload('image')],
            handler: this.controller.editUser,
        });
    }
}
