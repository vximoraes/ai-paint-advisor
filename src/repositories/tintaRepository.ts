import { PrismaClient } from '@prisma/client';
import { Tinta } from '../models/Tinta';

export class TintaRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async findAll(): Promise<Tinta[]> {
        return this.prisma.tinta.findMany();
    }

    async findById(id: number): Promise<Tinta | null> {
        return this.prisma.tinta.findUnique({ where: { id } });
    }

    async create(data: Omit<Tinta, 'id'>): Promise<Tinta> {
        return this.prisma.tinta.create({ data });
    }
}

export default TintaRepository;