import { JsonWebToken } from '@contracts/JsonWebToken';
import { AuthUser } from '@customTypes/AuthUser';
import { Email } from '@domain/Email';
import { User } from '@domain/User';
import { JwtError } from '@errors/JwtError';
import jwt from 'jsonwebtoken';

export class JwtService implements JsonWebToken {
    private secret: string;
    constructor(secret: string) {
        this.secret = secret;
    }
    sign(payload: User): string {
        try {
            const token = jwt.sign({ id: payload.getId(), email: payload.getEmail().getValue() }, this.secret, { expiresIn: '1h' });
            return token;
        } catch (error: any) {
            console.error('Error signing token:', error.message);
            throw new JwtError('Error signing token', 500);
        }
    }
    verify(token: string): AuthUser {
        try {
            const decoded = jwt.verify(token, this.secret) as { id: string; email: string };
            return { id: parseInt(decoded.id), email: new Email(decoded.email) };
        } catch (error: any) {
            console.error('Error verifying token:', error.message);
            throw new JwtError('Invalid token');
        }
    }
}
