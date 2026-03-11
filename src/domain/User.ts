import { UserCreateRequestDTO } from '@dtos/UserCreateRequestDTO';
import { Email } from './Email';
import { File } from './File';
import { Password } from './Password';
import { Phone } from './Phone';
import { UserUpdateRequestDTO } from '@dtos/UserUpdateRequestDTO';

export class User {
    private id?: number;
    private name: string;
    private email: Email;
    private password: Password;
    private phone: Phone;
    private image?: File;
    constructor(name: string, email: Email, phone: Phone, encryptedPassword: Password, id?: number, image?: File);
    constructor(dto: UserCreateRequestDTO);
    constructor(
        nameOrDto: string | UserCreateRequestDTO,
        email?: Email,
        phone?: Phone,
        encryptedPassword?: Password,
        id?: number,
        image?: File,
    ) {
        if (typeof nameOrDto === 'string') {
            this.name = nameOrDto;
            this.email = email!;
            this.phone = phone!;
            this.password = encryptedPassword!;
            this.id = id;
            this.image = image;
        } else {
            this.name = nameOrDto.name;
            this.email = nameOrDto.email;
            this.phone = nameOrDto.phone;
            this.password = nameOrDto.password;
        }
    }
    getId(): number | undefined {
        return this.id;
    }
    getName(): string {
        return this.name;
    }
    getEmail(): Email {
        return this.email;
    }
    getPassword(): Password {
        return this.password;
    }
    getPhone(): Phone {
        return this.phone;
    }
    getImage(): File | undefined {
        return this.image;
    }

    update(dto: UserUpdateRequestDTO, image?: File) {
        this.name = dto.name || this.name;
        this.email = dto.email || this.email;
        this.phone = dto.phone || this.phone;
        this.password = dto.password || this.password;
        if (image) {
            this.image = image;
        }
    }
}
