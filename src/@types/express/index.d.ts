import { AuthUser } from '@customTypes/AuthUser';
declare module 'express-serve-static-core' {
    interface Request {
        authUser?: AuthUser;
    }
}
