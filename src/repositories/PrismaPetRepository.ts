import { PetRepository } from '@contracts/PetRepository';
import { Pet } from '@domain/Pet';
import { PetAge } from '@domain/PetAge';
import { File } from '@domain/File';
import { PetWeight } from '@domain/PetWeight';
import { DatabaseError } from '@errors/DatabaseError';
import { PetColor } from '@domain/PetColor';
import { DBCLient } from '@customTypes/DBClient';

export class PrismaPetRepository implements PetRepository {
    private prisma: DBCLient;

    constructor(prisma: DBCLient) {
        this.prisma = prisma;
        prisma.$connect();
        console.log('Conected to Prisma - Pet!');
    }
    async findByNameAndOwnerIdAndAge(name: string, ownerId: number, age: PetAge): Promise<Pet | undefined> {
        try {
            const prismaPet = await this.prisma.pet.findFirst({
                where: {
                    name,
                    ownerId,
                    age: age.getValue(),
                },
            });
            if (!prismaPet) {
                return undefined;
            }
            const PetAgeObj = new PetAge(prismaPet.age);
            const petWeight = new PetWeight(prismaPet.weight);
            const petColor = new PetColor(prismaPet.color);
            const petImages = (prismaPet.images as string[]).map((url) => new File(url));
            return new Pet(
                prismaPet.name,
                PetAgeObj,
                petWeight,
                petColor,
                petImages,
                prismaPet.ownerId,
                prismaPet.available,
                prismaPet.adopterId,
                prismaPet.id || undefined,
            );
        } catch (error: any) {
            console.error('Error finding pet by name, owner email and age:', error.message);
            throw new DatabaseError('Failed to find pet by name, owner email and age');
        }
    }
    async findAllByOwnerId(ownerId: number): Promise<Pet[] | undefined> {
        try {
            const prismaPets = await this.prisma.pet.findMany({
                where: {
                    ownerId,
                },
            });
            if (!prismaPets || prismaPets.length === 0) {
                return undefined;
            }
            return prismaPets.map((prismaPet) => {
                const PetAgeObj = new PetAge(prismaPet.age);
                const petWeight = new PetWeight(prismaPet.weight);
                const petColor = new PetColor(prismaPet.color);
                const petImages = (prismaPet.images as string[]).map((url) => new File(url));
                return new Pet(
                    prismaPet.name,
                    PetAgeObj,
                    petWeight,
                    petColor,
                    petImages,
                    prismaPet.ownerId,
                    prismaPet.available,
                    prismaPet.adopterId,
                    prismaPet.id || undefined,
                );
            });
        } catch (error: any) {
            console.error('Error finding pets by owner id:', error.message);
            throw new DatabaseError('Failed to find pets by owner id');
        }
    }
    async findAllByAdopterId(adopterId: number): Promise<Pet[] | undefined> {
        try {
            const prismaPets = await this.prisma.pet.findMany({
                where: {
                    adopterId,
                },
            });
            if (!prismaPets || prismaPets.length === 0) {
                return undefined;
            }
            return prismaPets.map((prismaPet) => {
                const PetAgeObj = new PetAge(prismaPet.age);
                const petWeight = new PetWeight(prismaPet.weight);
                const petColor = new PetColor(prismaPet.color);
                const petImages = (prismaPet.images as string[]).map((url) => new File(url));
                return new Pet(
                    prismaPet.name,
                    PetAgeObj,
                    petWeight,
                    petColor,
                    petImages,
                    prismaPet.ownerId,
                    prismaPet.available,
                    prismaPet.adopterId,
                    prismaPet.id || undefined,
                );
            });
        } catch (error: any) {
            console.error('Error finding pets by adopter id:', error.message);
            throw new DatabaseError('Failed to find pets by adopter id');
        }
    }
    async create(data: Pet): Promise<void> {
        try {
            await this.prisma.pet.create({
                data: {
                    name: data.getName(),
                    age: data.getAge().getValue(),
                    weight: data.getWeight().getValue(),
                    color: data.getColor().getValue(),
                    images: data.getImages().map((image) => image.getUrl()),
                    ownerId: data.getOwnerId(),
                    available: data.getAvailable(),
                },
            });
        } catch (error: any) {
            console.error('Error creating pet:', error.message);
            throw new DatabaseError('Failed to create pet');
        }
    }
    async update(data: Pet): Promise<void> {
        try {
            await this.prisma.pet.update({
                where: { id: data.getId() },
                data: {
                    name: data.getName(),
                    age: data.getAge().getValue(),
                    weight: data.getWeight().getValue(),
                    color: data.getColor().getValue(),
                    images: data.getImages().map((image) => image.getUrl()),
                    ownerId: data.getOwnerId(),
                    available: data.getAvailable(),
                    adopterId: data.getAdopterId(),
                },
            });
        } catch (error: any) {
            console.error('Error updating pet:', error.message);
            throw new DatabaseError('Failed to update pet');
        }
    }
    async findAll(): Promise<Pet[] | undefined> {
        try {
            const prismaPets = await this.prisma.pet.findMany();
            if (!prismaPets || prismaPets.length === 0) {
                return undefined;
            }
            return prismaPets.map((prismaPet) => {
                const PetAgeObj = new PetAge(prismaPet.age);
                const petWeight = new PetWeight(prismaPet.weight);
                const petColor = new PetColor(prismaPet.color);
                const petImages = (prismaPet.images as string[]).map((url) => new File(url));
                return new Pet(
                    prismaPet.name,
                    PetAgeObj,
                    petWeight,
                    petColor,
                    petImages,
                    prismaPet.ownerId,
                    prismaPet.available,
                    prismaPet.adopterId,
                    prismaPet.id || undefined,
                );
            });
        } catch (error: any) {
            console.error('Error finding all pets:', error.message);
            throw new DatabaseError('Failed to find all pets');
        }
    }
    async findById(id: number): Promise<Pet | undefined> {
        try {
            const prismaPet = await this.prisma.pet.findUnique({
                where: {
                    id,
                },
            });
            if (!prismaPet) {
                return undefined;
            }
            const PetAgeObj = new PetAge(prismaPet.age);
            const petWeight = new PetWeight(prismaPet.weight);
            const petColor = new PetColor(prismaPet.color);
            const petImages = (prismaPet.images as string[]).map((url) => new File(url));
            return new Pet(
                prismaPet.name,
                PetAgeObj,
                petWeight,
                petColor,
                petImages,
                prismaPet.ownerId,
                prismaPet.available,
                prismaPet.adopterId,
                prismaPet.id || undefined,
            );
        } catch (error: any) {
            console.error('Error finding pet by id:', error.message);
            throw new DatabaseError('Failed to find pet by id');
        }
    }
    async deleteById(id: number): Promise<void> {
        try {
            await this.prisma.pet.delete({
                where: { id: id },
            });
        } catch (error: any) {
            console.error('Error deleting pet:', error.message);
            throw new DatabaseError('Failed to delete pet');
        }
    }
}
