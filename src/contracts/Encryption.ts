export interface Encryption {
    encrypt(value: string): Promise<string>;
    check(value: string, encryptedValue: string): Promise<boolean>;
}
