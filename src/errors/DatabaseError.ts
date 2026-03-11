import { HttpStatusCode } from '@enums/HttpStatusCode';
import { HttpError } from './HttpError';

export class DatabaseError extends HttpError {
    constructor(message: string) {
        super(HttpStatusCode.INTERNAL_SERVER_ERROR, message);
    }
}
