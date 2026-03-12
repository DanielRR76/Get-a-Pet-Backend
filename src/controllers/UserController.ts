import { Request, Response } from 'express';
import { UserCreateRequest } from '@customTypes/UserCreateRequest';
import { UserService } from '@services/UserService';
import { UserCreateRequestDTO } from '@dtos/UserCreateRequestDTO';
import { HttpError } from '@errors/HttpError';
import { LoginRequest } from '@customTypes/LoginRequest';
import { LoginRequestDTO } from '@dtos/LoginRequestDTO';
import { UserUpdateRequest } from '@customTypes/UserUpdateRequest';
import { UserUpdateRequestDTO } from '@dtos/UserUpdateRequestDTO';

export default class UserController {
    private service: UserService;
    constructor(service: UserService) {
        this.service = service;
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.checkUser = this.checkUser.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.editUser = this.editUser.bind(this);
    }
    async register(req: Request<object, object, UserCreateRequest>, res: Response) {
        const { name, email, phone, password, confirmPassword } = req.body;
        try {
            const dto = new UserCreateRequestDTO(name, email, phone, password, confirmPassword);
            const response = await this.service.register(dto);
            res.status(response.statusCode).json({ message: response.message, token: response.payload });
        } catch (error: any) {
            if (error instanceof HttpError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error('Unexpected error:', error.message);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    async login(req: Request<object, object, LoginRequest>, res: Response) {
        const { email, password } = req.body;
        try {
            const dto = new LoginRequestDTO(email, password);
            const response = await this.service.login(dto);
            res.status(response.statusCode).json({ message: response.message, token: response.payload });
        } catch (error: any) {
            if (error instanceof HttpError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error('Unexpected error:', error.message);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    async checkUser(req: Request, res: Response) {
        try {
            const response = await this.service.checkUser(req.authUser!);
            res.status(response.statusCode).json({ message: response.message, user: response.payload });
        } catch (error: any) {
            if (error instanceof HttpError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error('Unexpected error:', error.message);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const response = await this.service.getUserById(id);
            res.status(response.statusCode).json({ message: response.message, user: response.payload });
        } catch (error: any) {
            if (error instanceof HttpError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error('Unexpected error:', error.message);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    async editUser(req: Request<object, object, UserUpdateRequest>, res: Response) {
        try {
            const dto = new UserUpdateRequestDTO(
                req.body.name,
                req.body.email,
                req.body.phone,
                req.body.password,
                req.body.confirmPassword,
                req.file,
            );
            const response = await this.service.editUser(req.authUser!, dto);
            res.status(response.statusCode).json({ message: response.message, user: response.payload });
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
