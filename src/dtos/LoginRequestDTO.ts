import { Email } from '@domain/Email';
import { Password } from '@domain/Password';

export class LoginRequestDTO {
    readonly email: Email;
    readonly password: Password;
    constructor(email: string, password: string) {
        if (!email) {
            throw new Error('Email is required');
        }
        if (!password) {
            throw new Error('Password is required');
        }
        this.email = new Email(email);
        this.password = new Password(password);
    }
}
