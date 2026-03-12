import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { PrismaClient } from 'generated/prisma/client';

export class Prisma {
    private static instance: PrismaClient;

    private constructor() {}

    public static getInstance(): PrismaClient {
        if (!Prisma.instance) {
            const connectionString = `${process.env.DATABASE_URL}`;
            const adapter = new PrismaPg({ connectionString });
            Prisma.instance = new PrismaClient({ adapter });
            console.log('Connected to Prisma!');
        }
        return Prisma.instance;
    }
}
