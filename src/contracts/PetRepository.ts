import { Pet } from '@domain/Pet';
import { Database } from './Database';
import { PetAge } from '@domain/PetAge';

export interface PetRepository extends Database {
    findByNameAndOwnerIdAndAge(name: string, ownerId: number, age: PetAge): Promise<Pet | undefined>;
    findAllByOwnerId(ownerId: number): Promise<Pet[] | undefined>;
    findAllByAdopterId(adopterId: number): Promise<Pet[] | undefined>;
    create(data: Pet): Promise<void>;
    update(data: Pet): Promise<void>;
    findAll(): Promise<Pet[] | undefined>;
    findById(id: number): Promise<Pet | undefined>;
}
