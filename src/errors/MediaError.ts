import { HttpStatusCode } from '@enums/HttpStatusCode';
import { HttpError } from './HttpError';

export class MediaError extends HttpError {
    constructor(message: string, statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR) {
        super(statusCode, message);
    }
}
