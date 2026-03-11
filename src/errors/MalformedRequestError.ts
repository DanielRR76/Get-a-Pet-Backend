import { HttpStatusCode } from '@enums/HttpStatusCode';
import { HttpError } from './HttpError';

export class MalformedRequestError extends HttpError {
    constructor(message: string) {
        super(HttpStatusCode.BAD_REQUEST, message);
    }
}
