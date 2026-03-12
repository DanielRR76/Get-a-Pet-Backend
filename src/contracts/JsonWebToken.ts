import { AuthUser } from '@customTypes/AuthUser';
import { User } from '@domain/User';

export interface JsonWebToken {
    sign(payload: User): string;
    verify(token: string): AuthUser;
}
