import { PetAge } from '@domain/PetAge';
import { PetWeight } from '@domain/PetWeight';
import { MalformedRequestError } from '@errors/MalformedRequestError';
import { FileDTO } from './FileDTO';
import { PetColor } from '@domain/PetColor';

export class PetCreateRequestDTO {
    readonly name: string;
    readonly age: PetAge;
    readonly weight: PetWeight;
    readonly color: PetColor;
    readonly images: FileDTO[];
    constructor(name?: string, age?: string, weight?: string, color?: string, images?: FileDTO[]) {
        if (!name) {
            throw new MalformedRequestError('Name is required');
        }
        if (!age) {
            throw new MalformedRequestError('Age is required');
        }
        if (!weight) {
            throw new MalformedRequestError('Weight is required');
        }
        if (!color) {
            throw new MalformedRequestError('Color is required');
        }
        if (!images || images.length === 0) {
            throw new MalformedRequestError('At least one image is required');
        }
        this.name = name;
        this.age = new PetAge(Number(age));
        this.weight = new PetWeight(Number(weight.replace(',', '.')));
        this.color = new PetColor(color);
        this.images = images;
    }
}
