import { Encryption } from '@contracts/Encryption';
import { EncryptionError } from '@errors/EncryptionError';
import bcrypt from 'bcrypt';

export class BcryptService implements Encryption {
    private static instance: BcryptService;
    private saltRounds: number;
    private salt: string | undefined;
    private constructor(saltRounds: number = 10) {
        this.saltRounds = saltRounds;
    }
    public static getInstance(saltRounds: number = 10): BcryptService {
        if (!BcryptService.instance) {
            BcryptService.instance = new BcryptService(saltRounds);
        }
        return BcryptService.instance;
    }
    async setSalt() {
        try {
            this.salt = await bcrypt.genSalt(this.saltRounds);
        } catch (error: any) {
            console.error('Encryption error:', error.message);
            throw new EncryptionError('Failed to generate salt');
        }
    }
    async encrypt(value: string): Promise<string> {
        try {
            if (!this.salt) {
                await this.setSalt();
            }
            return await bcrypt.hash(value, this.salt!);
        } catch (error: any) {
            console.error('Encryption error:', error.message);
            throw new EncryptionError('Failed to encrypt password');
        }
    }
    async check(value: string, encryptedValue: string): Promise<boolean> {
        try {
            return await bcrypt.compare(value, encryptedValue);
        } catch (error: any) {
            console.error('Encryption error:', error.message);
            throw new EncryptionError('Failed to compare password');
        }
    }
}
