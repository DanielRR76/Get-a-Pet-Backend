import { Email } from '@domain/Email';
import { Password } from '@domain/Password';
import { Phone } from '@domain/Phone';
import { MalformedRequestError } from '@errors/MalformedRequestError';

export class UserCreateRequestDTO {
    readonly name: string;
    readonly email: Email;
    readonly phone: Phone;
    readonly password: Password;
    constructor(name: string, email: string, phone: string, password: string, confirmPassword: string) {
        if (!name) {
            throw new MalformedRequestError('Name is required');
        }
        if (!email) {
            throw new MalformedRequestError('Email is required');
        }
        if (!phone) {
            throw new MalformedRequestError('Phone is required');
        }
        if (!password) {
            throw new MalformedRequestError('Password is required');
        }
        if (!confirmPassword) {
            throw new MalformedRequestError('Confirm password is required');
        }
        if (password !== confirmPassword) {
            throw new MalformedRequestError('Passwords do not match');
        }
        this.name = name;
        this.email = new Email(email);
        this.phone = new Phone(phone);
        this.password = new Password(password);
    }
}
