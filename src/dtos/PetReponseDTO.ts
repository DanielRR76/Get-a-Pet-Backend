import { Pet } from '@domain/Pet';

export class PetResponseDTO {
    readonly id: number;
    readonly name: string;
    readonly age: number;
    readonly weight: number;
    readonly color: string;
    readonly images: string[];
    readonly available: boolean;
    readonly adopterId?: number;
    readonly ownerId: number;

    constructor(pet: Pet) {
        this.id = pet.getId()!;
        this.name = pet.getName();
        this.age = pet.getAge().getValue();
        this.weight = pet.getWeight().getValue();
        this.color = pet.getColor().getValue();
        this.images = pet.getImages().map((file) => file.getUrl());
        this.ownerId = pet.getOwnerId();
        this.available = pet.getAvailable();
        this.adopterId = pet.getAdopterId() || undefined;
    }
}
