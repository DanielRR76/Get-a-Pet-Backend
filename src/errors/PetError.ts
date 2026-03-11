import { HttpError } from './HttpError';

export class PetError extends HttpError {
    constructor(message: string, statusCode: number) {
        super(statusCode, message);
    }
}
