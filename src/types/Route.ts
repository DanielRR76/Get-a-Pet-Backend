import { HttpMethod } from '@enums/HttpMethod';

export type Route = {
    method: HttpMethod;
    path: string;
    middleware: ((...args: any[]) => any)[];
    handler: (req: any, res: any) => void | Promise<void>;
};
