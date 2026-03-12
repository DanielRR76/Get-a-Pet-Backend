import { Route } from '@customTypes/Route';

export abstract class Router {
    routes: Route[] = [];
    addRoute(route: Route): void {
        this.routes.push(route);
    }
}
