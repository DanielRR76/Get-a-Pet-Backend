import { HttpStatusCode } from '@enums/HttpStatusCode';
import { HttpError } from './HttpError';

export class JwtError extends HttpError {
    constructor(message: string, statusCode = HttpStatusCode.UNAUTHORIZED) {
        super(statusCode, message);
    }
}
