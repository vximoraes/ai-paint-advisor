import { PrismaClient } from '@prisma/client';
import { Tinta } from '../models/Tinta';

const prisma = new PrismaClient();

export const tintaRepository = {
    findAll: async (): Promise<Tinta[]> => {
        return prisma.tinta.findMany();
    },
    findById: async (id: number): Promise<Tinta | null> => {
        return prisma.tinta.findUnique({ where: { id } });
    },
    create: async (data: Omit<Tinta, 'id'>): Promise<Tinta> => {
        return prisma.tinta.create({ data });
    },
};