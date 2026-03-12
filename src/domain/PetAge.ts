import { PetAgeError } from '@errors/PetAgeError';

export class PetAge {
    private value: number;
    constructor(value: number) {
        if (value < 0) {
            throw new PetAgeError('Age cannot be negative');
        }
        if (value > 20) {
            throw new PetAgeError('Age cannot be greater than 20');
        }
        this.value = value;
    }

    getValue(): number {
        return this.value;
    }
}
