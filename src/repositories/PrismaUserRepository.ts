import { UserRepository } from '@contracts/UserRepository';
import { DBCLient } from '@customTypes/DBClient';
import { Email } from '@domain/Email';
import { File } from '@domain/File';
import { Password } from '@domain/Password';
import { Phone } from '@domain/Phone';
import { User } from '@domain/User';
import { DatabaseError } from '@errors/DatabaseError';

export class PrismaUserRepository implements UserRepository {
    private prisma: DBCLient;

    constructor(prisma: DBCLient) {
        this.prisma = prisma;
        prisma.$connect();
        console.log('Conected to Prisma - User!');
    }
    async create(data: User): Promise<void> {
        try {
            await this.prisma.user.create({
                data: {
                    name: data.getName(),
                    email: data.getEmail().getValue(),
                    phone: data.getPhone().getValue(),
                    password: data.getPassword().getValue(),
                },
            });
        } catch (error: any) {
            console.error('Error creating user:', error.message);
            throw new DatabaseError('Failed to create user');
        }
    }
    async findByEmail(email: Email): Promise<User | undefined> {
        try {
            const primsaUser = await this.prisma.user.findUnique({
                where: { email: email.getValue() },
            });
            if (!primsaUser) {
                return undefined;
            }
            const emailObj = new Email(primsaUser.email);
            const phone = new Phone(primsaUser.phone);
            const password = new Password(primsaUser.password, false);
            const image = primsaUser.image ? new File(primsaUser.image) : undefined;
            return new User(primsaUser.name, emailObj, phone, password, primsaUser.id, image);
        } catch (error: any) {
            console.error('Error finding user by email:', error.message);
            throw new DatabaseError('Failed to find user by email');
        }
    }
    async deleteById(id: number): Promise<void> {
        try {
            await this.prisma.user.delete({
                where: { id: id },
            });
        } catch (error: any) {
            console.error('Error deleting user:', error.message);
            throw new DatabaseError('Failed to delete user');
        }
    }
    async findById(id: number): Promise<User | undefined> {
        try {
            const primsaUser = await this.prisma.user.findUnique({
                where: { id: id },
            });
            if (!primsaUser) {
                return undefined;
            }
            const email = new Email(primsaUser.email);
            const phone = new Phone(primsaUser.phone);
            const password = new Password(primsaUser.password, false);
            const image = primsaUser.image ? new File(primsaUser.image) : undefined;
            return new User(primsaUser.name, email, phone, password, primsaUser.id, image);
        } catch (error: any) {
            console.error('Error finding user by id:', error.message);
            throw new DatabaseError('Failed to find user by id');
        }
    }
    async findAll(): Promise<User[] | undefined> {
        try {
            const prismaUsers = await this.prisma.user.findMany();
            if (prismaUsers.length === 0) {
                return undefined;
            }
            return prismaUsers.map((primsaUser) => {
                const email = new Email(primsaUser.email);
                const phone = new Phone(primsaUser.phone);
                const password = new Password(primsaUser.password, false);
                const image = primsaUser.image ? new File(primsaUser.image) : undefined;
                return new User(primsaUser.name, email, phone, password, primsaUser.id, image);
            });
        } catch (error: any) {
            console.error('Error finding all users:', error.message);
            throw new DatabaseError('Failed to find all users');
        }
    }
    async update(data: User): Promise<void> {
        try {
            await this.prisma.user.update({
                where: { id: data.getId() },
                data: {
                    name: data.getName(),
                    email: data.getEmail().getValue(),
                    phone: data.getPhone().getValue(),
                    password: data.getPassword().getValue(),
                    image: data.getImage()?.getUrl(),
                },
            });
        } catch (error: any) {
            console.error('Error updating user:', error.message);
            throw new DatabaseError('Failed to update user');
        }
    }
}
