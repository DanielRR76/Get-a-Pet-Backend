import { HttpStatusCode } from '@enums/HttpStatusCode';
import { EmailError } from '@errors/EmailError';

export class Email {
    private value: string;
    constructor(value: string) {
        if (!this.validate(value)) {
            throw new EmailError('Invalid email format', HttpStatusCode.BAD_REQUEST);
        }
        this.value = value;
    }
    private validate(value: string): boolean {
        const emailRegex = /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*@[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/;
        return emailRegex.test(value);
    }
    getValue(): string {
        return this.value;
    }
}
