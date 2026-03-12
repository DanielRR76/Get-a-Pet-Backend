import express, { Response, Request } from 'express';
import cors from 'cors';
import { HttpServer } from '@contracts/HttpServer';
import 'dotenv/config';
import { Router } from '@contracts/Router';
import { HttpMethod } from '@enums/HttpMethod';

export class ExpressServer implements HttpServer {
    private app: express.Express;
    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors({ credentials: true, origin: process.env.CORS_ORIGIN }));
        this.app.use(express.static('public'));
    }
    routes(path: string, router: Router): void {
        const expressRouter = express.Router();
        router.routes.forEach((route) => {
            expressRouter[route.method](route.path, ...route.middleware, route.handler);
        });
        this.app.use(path, expressRouter);
    }
    route(method: HttpMethod, path: string, callback: (req: Request, res: Response) => void | Promise<void>): void {
        this.app[method](path, callback);
    }
    listen(port: number, callback?: () => void): void {
        this.app.listen(port, callback);
    }
}
