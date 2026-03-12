import { Router } from '@contracts/Router';
import { HttpMethod } from '../enums/HttpMethod';
export interface HttpServer {
    listen(port: number, callback?: () => void): void;
    route(method: HttpMethod, path: string, callback: (req: any, res: any) => void | Promise<void>): void;
    routes(path: string, router: Router): void;
}
