import { JsonWebToken } from '@contracts/JsonWebToken';
import { MediaService } from '@contracts/MediaService';
import { UserRepository } from '@contracts/UserRepository';
import { HttpResponse } from '@domain/HttpResponse';
import { File } from '@domain/File';
import { User } from '@domain/User';
import { LoginRequestDTO } from '@dtos/LoginRequestDTO';
import { UserCreateRequestDTO } from '@dtos/UserCreateRequestDTO';
import { UserResponseDTO } from '@dtos/UserResponseDTO';
import { UserUpdateRequestDTO } from '@dtos/UserUpdateRequestDTO';
import { DatabaseError } from '@errors/DatabaseError';
import { EmailError } from '@errors/EmailError';
import { AuthUser } from '@customTypes/AuthUser';
import { HttpStatusCode } from '@enums/HttpStatusCode';

export class UserService {
    private jwtService: JsonWebToken;
    private userRepository: UserRepository;
    private mediaService: MediaService;
    constructor(jwtService: JsonWebToken, userRepository: UserRepository, mediaService: MediaService) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.mediaService = mediaService;
    }
    async register(dto: UserCreateRequestDTO) {
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser) {
            throw new EmailError('Email already in use', HttpStatusCode.CONFLICT);
        }
        await dto.password.encrypt();
        const user = new User(dto);
        await this.userRepository.create(user);
        const createdUser = await this.userRepository.findByEmail(dto.email);
        const token = this.jwtService.sign(createdUser!);
        return new HttpResponse(HttpStatusCode.CREATED, 'User registered successfully', token);
    }

    async login(dto: LoginRequestDTO) {
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            throw new EmailError('User not found', HttpStatusCode.NOT_FOUND);
        }
        await user.getPassword().compare(dto.password.getValue());
        const token = this.jwtService.sign(user);
        return new HttpResponse(HttpStatusCode.OK, 'Login successful', token);
    }

    async checkUser(authUser: AuthUser) {
        const user = await this.userRepository.findByEmail(authUser.email);
        if (!user) {
            throw new EmailError('User not found', HttpStatusCode.NOT_FOUND);
        }
        const payload = new UserResponseDTO(
            user.getName(),
            user.getEmail().getValue(),
            user.getPhone().getValue(),
            user.getImage()?.getUrl(),
        );
        return new HttpResponse(HttpStatusCode.OK, 'User authenticated successfully', payload);
    }

    async getUserById(id: number) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new EmailError('User not found', HttpStatusCode.NOT_FOUND);
        }
        const payload = new UserResponseDTO(
            user.getName(),
            user.getEmail().getValue(),
            user.getPhone().getValue(),
            user.getImage()?.getUrl(),
        );
        return new HttpResponse(HttpStatusCode.OK, 'User retrieved successfully', payload);
    }

    async editUser(authUser: AuthUser, dto: UserUpdateRequestDTO) {
        const user = await this.userRepository.findByEmail(authUser.email);
        if (!user) {
            throw new EmailError('User not found', HttpStatusCode.NOT_FOUND);
        }
        let imageUrl: File | undefined;
        if (dto.image) {
            imageUrl = (await this.mediaService.upload(dto.image)) as File;
        }
        await dto.password?.encrypt();
        user.update(dto, imageUrl);
        try {
            await this.userRepository.update(user);
            return new HttpResponse(HttpStatusCode.OK, 'User updated successfully');
        } catch (error: any) {
            if (imageUrl) {
                try {
                    await this.mediaService.delete(imageUrl);
                } catch (deleteError) {
                    console.error('Failed to rollback image upload', deleteError);
                }
            }
            console.error('Error updating user:', error.message);
            throw new DatabaseError('Failed to update user');
        }
    }
}
