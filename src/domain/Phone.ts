import { PhoneError } from '@errors/PhoneError';

export class Phone {
    private value: string;
    constructor(value: string) {
        if (!this.validate(value)) {
            throw new PhoneError('Phone number must be in the format (XX) 9XXXX-XXXX. Only numbers are allowed.');
        }
        this.value = value;
    }
    private validate(value: string): boolean {
        const phoneRegex = /^(1[1-9]|2[1-35-9]|3[1-5789]|4[1-24-9]|5[1-5]|6[1-69]|7[1-69]|8[1-9]|9[15689])9\d{8}$/;
        return phoneRegex.test(value);
    }
    getValue(): string {
        return this.value;
    }
}
