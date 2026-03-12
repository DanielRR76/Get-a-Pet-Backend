import { PetWeightError } from '@errors/PetWeightError';

export class PetWeight {
    private value: number;
    constructor(value: number) {
        if (value < 0) {
            throw new PetWeightError('Weight cannot be negative');
        }
        if (value > 160) {
            throw new PetWeightError('Weight cannot be greater than 160');
        }
        this.value = value;
    }

    getValue(): number {
        return this.value;
    }
}
