import { HttpStatusCode } from '@enums/HttpStatusCode';
import { HttpError } from './HttpError';

export class FileError extends HttpError {
    constructor(message: string, statusCode = HttpStatusCode.BAD_REQUEST) {
        super(statusCode, message);
    }
}
