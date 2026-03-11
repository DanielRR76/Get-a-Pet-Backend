import { ImageFile } from '@customTypes/ImageFile';
import { Email } from '@domain/Email';
import { Password } from '@domain/Password';
import { Phone } from '@domain/Phone';
import { MalformedRequestError } from '@errors/MalformedRequestError';
import { FileDTO } from './FileDTO';
export class UserUpdateRequestDTO {
    readonly name?: string;
    readonly email?: Email;
    readonly phone?: Phone;
    readonly password?: Password;
    readonly image?: FileDTO;
    constructor(name?: string, email?: string, phone?: string, password?: string, confirmPassword?: string, image?: ImageFile) {
        if (name === '') {
            throw new MalformedRequestError('Name cannot be empty');
        }
        if (email === '') {
            throw new MalformedRequestError('Email cannot be empty');
        }
        if (phone === '') {
            throw new MalformedRequestError('Phone cannot be empty');
        }
        if (password === '') {
            throw new MalformedRequestError('Password cannot be empty');
        }
        if (confirmPassword === '') {
            throw new MalformedRequestError('Confirm password cannot be empty');
        }
        if (password && confirmPassword && password !== confirmPassword) {
            throw new MalformedRequestError('Passwords do not match');
        }
        this.name = name;
        this.email = email ? new Email(email) : undefined;
        this.phone = phone ? new Phone(phone) : undefined;
        this.password = password ? new Password(password) : undefined;
        this.image = image ? new FileDTO(image.originalname, 'users', image.buffer) : undefined;
    }
}
