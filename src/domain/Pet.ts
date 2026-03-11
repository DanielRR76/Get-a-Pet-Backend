import { PetAge } from './PetAge';
import { PetWeight } from './PetWeight';
import { File } from './File';
import { PetColor } from './PetColor';
import { PetCreateRequestDTO } from '@dtos/PetCreateRequestDTO';
import { PetUpdateRequestDTO } from '@dtos/PetUpdateRequestDTO';
import { PetError } from '@errors/PetError';

export class Pet {
    private id?: number;
    private name: string;
    private age: PetAge;
    private weight: PetWeight;
    private color: PetColor;
    private images: File[];
    private available: boolean;
    private adopterId: number | null;
    private ownerId: number;
    constructor(
        name: string,
        age: PetAge,
        weight: PetWeight,
        color: PetColor,
        images: File[],
        ownerId: number,
        available: boolean,
        adopterId: number | null,
        id?: number,
    );
    constructor(dto: PetCreateRequestDTO, images: File[], ownerId: number);
    constructor(
        nameOrDto: string | PetCreateRequestDTO,
        ageOrImages: PetAge | File[],
        weightOrOwnerId: PetWeight | number,
        color?: PetColor,
        images?: File[],
        ownerId?: number,
        available?: boolean,
        adopterId?: number | null,
        id?: number,
    ) {
        if (typeof nameOrDto === 'string') {
            this.name = nameOrDto;
            this.age = ageOrImages as PetAge;
            this.weight = weightOrOwnerId as PetWeight;
            this.color = color!;
            this.images = images!;
            this.ownerId = ownerId!;
            this.available = available!;
            this.adopterId = adopterId || null;
            this.id = id;
        } else {
            this.name = nameOrDto.name;
            this.age = nameOrDto.age;
            this.weight = nameOrDto.weight;
            this.color = nameOrDto.color;
            this.images = ageOrImages as File[];
            this.available = true;
            this.ownerId = weightOrOwnerId as number;
            this.adopterId = null;
        }
    }

    getAge(): PetAge {
        return this.age;
    }

    getWeight(): PetWeight {
        return this.weight;
    }

    getName(): string {
        return this.name;
    }

    getColor(): PetColor {
        return this.color;
    }

    getImages(): File[] {
        return this.images;
    }

    getAvailable(): boolean {
        return this.available;
    }

    getAdopterId(): number | null {
        return this.adopterId;
    }

    getOwnerId(): number {
        return this.ownerId;
    }

    getId(): number | undefined {
        return this.id;
    }

    update(dto: PetUpdateRequestDTO, images?: File[]) {
        this.name = dto.name || this.name;
        this.age = dto.age || this.age;
        this.weight = dto.weight || this.weight;
        this.color = dto.color || this.color;
        if (images) {
            this.images = images;
        }
    }

    completeAdoption() {
        if (!this.adopterId) {
            throw new PetError('Pet is not scheduled for adoption', 400);
        }
        this.available = false;
        this.ownerId = this.adopterId!;
        this.adopterId = null;
    }

    scheduleAdoption(adopterId: number) {
        this.adopterId = adopterId;
    }
}
