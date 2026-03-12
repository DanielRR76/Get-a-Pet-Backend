import { Encryption } from '@contracts/Encryption';
import { HttpStatusCode } from '@enums/HttpStatusCode';
import { PasswordError } from '@errors/PasswordError';
import { BcryptService } from '@services/BcryptService';

export class Password {
    private value: string;
    private encryption: Encryption;
    constructor(value: string, isRawValue = true, encryption: Encryption = BcryptService.getInstance()) {
        if (isRawValue && !this.validate(value)) {
            throw new PasswordError(
                'Password must be 8-15 characters long, contain at least one uppercase letter, one lowercase letter, one number, one special character, and no repeated characters',
                HttpStatusCode.BAD_REQUEST,
            );
        }
        this.encryption = encryption;
        this.value = value;
    }
    setEncryption(encryption: Encryption) {
        this.encryption = encryption;
    }
    private validate(value: string): boolean {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])(?!.*(.)\1)[\S]{8,15}$/;
        return passwordRegex.test(value);
    }
    getValue(): string {
        return this.value;
    }

    async encrypt(): Promise<void> {
        this.value = await this.encryption.encrypt(this.value);
    }

    async compare(rawValue: string): Promise<void> {
        const isPasswordValid = await this.encryption.check(rawValue, this.value);
        if (!isPasswordValid) {
            throw new PasswordError('Invalid password', HttpStatusCode.UNAUTHORIZED);
        }
    }
}
