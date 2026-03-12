import { validColors } from '@constants/validColors';
import { ImageFile } from '@customTypes/ImageFile';
import { PetCreateRequest } from '@customTypes/PetCreateRequest';
import { PetUpdateRequest } from '@customTypes/PetUpdateRequest';
import { FileDTO } from '@dtos/FileDTO';
import { PetCreateRequestDTO } from '@dtos/PetCreateRequestDTO';
import { PetUpdateRequestDTO } from '@dtos/PetUpdateRequestDTO';
import { HttpError } from '@errors/HttpError';
import { PetService } from '@services/PetService';
import { Request, Response } from 'express';
export default class PetController {
    private service: PetService;
    constructor(petService: PetService) {
        this.service = petService;
        this.create = this.create.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getColors = this.getColors.bind(this);
        this.getAllUserPets = this.getAllUserPets.bind(this);
        this.getAllUserAdoptions = this.getAllUserAdoptions.bind(this);
        this.getPetById = this.getPetById.bind(this);
        this.deletePetById = this.deletePetById.bind(this);
        this.updatePet = this.updatePet.bind(this);
        this.scheduleAdoption = this.scheduleAdoption.bind(this);
        this.completeAdoption = this.completeAdoption.bind(this);
    }
    async create(req: Request<object, object, PetCreateRequest>, res: Response) {
        try {
            const images = Array.isArray(req.files)
                ? req.files.map((file: ImageFile) => new FileDTO(file.originalname, 'pets', file.buffer))
                : undefined;
            const dto = new PetCreateRequestDTO(req.body?.name, req.body?.age, req.body?.weight, req.body?.color, images);
            const response = await this.service.create(dto, req.authUser!);
            res.status(response.statusCode).json({ message: response.message, pet: response.payload });
        } catch (error: any) {
            if (error instanceof HttpError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error('Unexpected error:', error.message);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    async getAll(_: Request, res: Response) {
        try {
            const response = await this.service.getAll();
            res.status(response.statusCode).json({ message: response.message, pets: response.payload });
        } catch (error: any) {
            if (error instanceof HttpError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error('Unexpected error:', error.message);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    getColors(_: Request, res: Response) {
        res.status(200).json({ validColors });
    }

    async getAllUserPets(req: Request, res: Response) {
        try {
            const response = await this.service.getAllUserPets(req.authUser!);
            res.status(response.statusCode).json({ message: response.message, pets: response.payload });
        } catch (error: any) {
            if (error instanceof HttpError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error('Unexpected error:', error.message);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    async getAllUserAdoptions(req: Request, res: Response) {
        try {
            const response = await this.service.getAllUserAdoptions(req.authUser!);
            res.status(response.statusCode).json({ message: response.message, pets: response.payload });
        } catch (error: any) {
            if (error instanceof HttpError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error('Unexpected error:', error.message);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    async getPetById(req: Request<{ id: string }>, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const response = await this.service.getPetById(id);
            res.status(response.statusCode).json({ message: response.message, pet: response.payload });
        } catch (error: any) {
            if (error instanceof HttpError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error('Unexpected error:', error.message);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    async deletePetById(req: Request<{ id: string }>, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const response = await this.service.deletePetById(id, req.authUser!);
            res.status(response.statusCode).json({ message: response.message, pet: response.payload });
        } catch (error: any) {
            if (error instanceof HttpError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error('Unexpected error:', error.message);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    async updatePet(req: Request<{ id: string }, object, PetUpdateRequest>, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const images = Array.isArray(req.files)
                ? req.files.map((file: ImageFile) => new FileDTO(file.originalname, 'pets', file.buffer))
                : undefined;
            const dto = new PetUpdateRequestDTO(req.body.name, req.body.age, req.body.weight, req.body.color, images);
            const response = await this.service.updatePet(id, dto, req.authUser!);
            res.status(response.statusCode).json({ message: response.message, pet: response.payload });
        } catch (error: any) {
            if (error instanceof HttpError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error('Unexpected error:', error.message);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    async scheduleAdoption(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const response = await this.service.scheduleAdoption(id, req.authUser!);
            res.status(response.statusCode).json({ message: response.message, pet: response.payload });
        } catch (error: any) {
            if (error instanceof HttpError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error('Unexpected error:', error.message);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    async completeAdoption(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const response = await this.service.completeAdoption(id, req.authUser!);
            res.status(response.statusCode).json({ message: response.message, pet: response.payload });
        } catch (error: any) {
            if (error instanceof HttpError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error('Unexpected error:', error.message);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }
}
