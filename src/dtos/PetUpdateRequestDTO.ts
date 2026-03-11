import { PetAge } from '@domain/PetAge';
import { PetWeight } from '@domain/PetWeight';
import { MalformedRequestError } from '@errors/MalformedRequestError';
import { FileDTO } from './FileDTO';
import { PetColor } from '@domain/PetColor';

export class PetUpdateRequestDTO {
    readonly name?: string;
    readonly age?: PetAge;
    readonly weight?: PetWeight;
    readonly color?: PetColor;
    readonly images?: FileDTO[];
    constructor(name?: string, age?: string, weight?: string, color?: string, images?: FileDTO[]) {
        color = color?.toUpperCase();
        if (name === '') {
            throw new MalformedRequestError('Name cannot be empty');
        }
        if (age === '') {
            throw new MalformedRequestError('Age cannot be empty');
        }
        if (weight === '') {
            throw new MalformedRequestError('Weight cannot be empty');
        }
        if (color === '') {
            throw new MalformedRequestError('Color cannot be empty');
        }
        if (images && images.length === 0) {
            throw new MalformedRequestError('At least one image is required if images field is provided');
        }
        this.name = name;
        this.age = age ? new PetAge(Number(age)) : undefined;
        this.weight = weight ? new PetWeight(Number(weight.replace(',', '.'))) : undefined;
        this.color = color ? new PetColor(color) : undefined;
        this.images = images;
    }
}
