import { validColors } from '@constants/validColors';
import { PetColorError } from '@errors/PetColorError';

export class PetColor {
    private value: string;
    constructor(value: string) {
        if (!this.isValidColor(value)) {
            throw new PetColorError('Invalid color, valid colors are: ' + validColors.join(', '));
        }
        this.value = value.toUpperCase();
    }

    getValue(): string {
        return this.value;
    }
    isValidColor(color: string): boolean {
        return validColors.includes(color.toUpperCase());
    }
}
