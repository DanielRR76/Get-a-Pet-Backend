import { User } from '@domain/User';
import { Database } from './Database';
import { Email } from '@domain/Email';

export interface UserRepository extends Database {
    findByEmail(email: Email): Promise<User | undefined>;
    create(data: User): Promise<void>;
    findById(id: number): Promise<User | undefined>;
    findAll(): Promise<User[] | undefined>;
    update(data: User): Promise<void>;
}
