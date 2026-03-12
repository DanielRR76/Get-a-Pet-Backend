import { HttpStatusCode } from '@enums/HttpStatusCode';
import { HttpError } from './HttpError';

export class PasswordError extends HttpError {
    constructor(message: string, statusCode = HttpStatusCode.BAD_REQUEST) {
        super(statusCode, message);
    }
}
