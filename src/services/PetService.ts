import { MediaService } from '@contracts/MediaService';
import { PetRepository } from '@contracts/PetRepository';
import { AuthUser } from '@customTypes/AuthUser';
import { File } from '@domain/File';
import { HttpResponse } from '@domain/HttpResponse';
import { Pet } from '@domain/Pet';
import { PetCreateRequestDTO } from '@dtos/PetCreateRequestDTO';
import { PetResponseDTO } from '@dtos/PetReponseDTO';
import { PetUpdateRequestDTO } from '@dtos/PetUpdateRequestDTO';
import { HttpStatusCode } from '@enums/HttpStatusCode';
import { DatabaseError } from '@errors/DatabaseError';
import { PetError } from '@errors/PetError';

export class PetService {
    private petRepository: PetRepository;
    private mediaService: MediaService;
    constructor(petRepository: PetRepository, mediaService: MediaService) {
        this.petRepository = petRepository;
        this.mediaService = mediaService;
    }

    async create(dto: PetCreateRequestDTO, authUser: AuthUser) {
        const existingPet = await this.petRepository.findByNameAndOwnerIdAndAge(dto.name, authUser.id, dto.age);
        if (existingPet) {
            throw new PetError('Pet already exists', HttpStatusCode.CONFLICT);
        }
        const images: File[] = (await this.mediaService.upload(dto.images)) as File[];
        const pet = new Pet(dto, images, authUser.id);
        try {
            await this.petRepository.create(pet);
            const createdPet = await this.petRepository.findByNameAndOwnerIdAndAge(dto.name, authUser.id, dto.age);
            const payload = new PetResponseDTO(createdPet!);
            return new HttpResponse(HttpStatusCode.CREATED, 'Pet created successfully', payload);
        } catch (error: any) {
            if (images) {
                try {
                    await this.mediaService.delete(images);
                } catch (deleteError) {
                    console.error('Failed to delete uploaded images after pet creation failure:', deleteError);
                }
            }
            console.error('Error creating pet:', error.message);
            throw new DatabaseError('Failed to create pet');
        }
    }
    async getAll() {
        const pets = await this.petRepository.findAll();
        const payload = pets?.map((pet) => {
            return new PetResponseDTO(pet);
        });
        return new HttpResponse(HttpStatusCode.OK, 'Pets retrieved successfully', payload);
    }

    async getAllUserPets(authUser: AuthUser) {
        const userPets = await this.petRepository.findAllByOwnerId(authUser.id);
        const payload = userPets?.map((pet) => {
            return new PetResponseDTO(pet);
        });
        return new HttpResponse(HttpStatusCode.OK, 'User pets retrieved successfully', payload);
    }

    async getAllUserAdoptions(authUser: AuthUser) {
        const userAdoptions = await this.petRepository.findAllByAdopterId(authUser.id);
        const payload = userAdoptions?.map((pet) => {
            return new PetResponseDTO(pet);
        });
        return new HttpResponse(HttpStatusCode.OK, 'User adoptions retrieved successfully', payload);
    }
    async getPetById(id: number) {
        const pet = await this.petRepository.findById(id);
        if (!pet) {
            throw new PetError('Pet not found', HttpStatusCode.NOT_FOUND);
        }
        const payload = new PetResponseDTO(pet);
        return new HttpResponse(HttpStatusCode.OK, 'Pet retrieved successfully', payload);
    }

    async deletePetById(id: number, authUser: AuthUser) {
        const pet = await this.petRepository.findById(id);
        if (!pet) {
            throw new PetError('Pet not found', HttpStatusCode.NOT_FOUND);
        }
        if (pet.getOwnerId() !== authUser.id) {
            throw new PetError('You are not allowed to delete this pet', HttpStatusCode.FORBIDDEN);
        }
        await this.petRepository.deleteById(id);
        return new HttpResponse(HttpStatusCode.OK, 'Pet deleted successfully');
    }

    async updatePet(id: number, dto: PetUpdateRequestDTO, authUser: AuthUser) {
        const pet = await this.petRepository.findById(id);
        if (!pet) {
            throw new PetError('Pet not found', HttpStatusCode.NOT_FOUND);
        }
        if (pet.getOwnerId() !== authUser.id) {
            throw new PetError('You are not allowed to update this pet', HttpStatusCode.FORBIDDEN);
        }
        const images: File[] | undefined = dto.images ? ((await this.mediaService.upload(dto.images)) as File[]) : undefined;
        pet.update(dto, images);
        try {
            await this.petRepository.update(pet);
            return new HttpResponse(HttpStatusCode.OK, 'Pet updated successfully');
        } catch (error: any) {
            if (images) {
                try {
                    await this.mediaService.delete(images);
                } catch (deleteError) {
                    console.error('Failed to delete uploaded images after pet update failure:', deleteError);
                }
            }
            console.error('Error updating pet:', error.message);
            throw new DatabaseError('Failed to update pet');
        }
    }

    async scheduleAdoption(id: number, authUser: AuthUser) {
        const pet = await this.petRepository.findById(id);
        if (!pet) {
            throw new PetError('Pet not found', HttpStatusCode.NOT_FOUND);
        }
        if (!pet.getAvailable()) {
            throw new PetError('Pet is not available for adoption', HttpStatusCode.UNPROCESSABLE_ENTITY);
        }
        if (pet.getOwnerId() === authUser.id) {
            throw new PetError('You cannot adopt your own pet', HttpStatusCode.UNPROCESSABLE_ENTITY);
        }
        if (pet.getAdopterId() === authUser.id) {
            throw new PetError('You have already scheduled an adoption for this pet', HttpStatusCode.UNPROCESSABLE_ENTITY);
        }
        pet.scheduleAdoption(authUser.id);
        await this.petRepository.update(pet);
        return new HttpResponse(HttpStatusCode.OK, 'Adoption scheduled successfully');
    }

    async completeAdoption(id: number, authUser: AuthUser) {
        const pet = await this.petRepository.findById(id);
        if (!pet) {
            throw new PetError('Pet not found', HttpStatusCode.NOT_FOUND);
        }
        if (pet.getOwnerId() !== authUser.id) {
            throw new PetError('You are not allowed to complete the adoption of this pet', HttpStatusCode.FORBIDDEN);
        }
        pet.completeAdoption();
        await this.petRepository.update(pet);
        return new HttpResponse(HttpStatusCode.OK, 'Adoption completed successfully');
    }
}
