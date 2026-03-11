import { HttpStatusCode } from '@enums/HttpStatusCode';
import { HttpError } from './HttpError';

export class PetAgeError extends HttpError {
    constructor(message: string, statusCode = HttpStatusCode.BAD_REQUEST) {
        super(statusCode, message);
    }
}
