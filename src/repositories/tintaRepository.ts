import { PrismaClient } from '@prisma/client';
import { Tinta } from '../models/Tinta';
import { TintaCreateInput, TintaUpdateInput, ITintaRepository } from '../models/TintaTypes';

export class TintaRepository implements ITintaRepository {
    constructor(private prisma: PrismaClient) {}

    async create(data: TintaCreateInput) {
        return this.prisma.tinta.create({ data });
    }

    async findAll() {
        return this.prisma.tinta.findMany();
    }

    async findById(id: number) {
        return this.prisma.tinta.findUnique({ where: { id } });
    }

    async update(id: number, data: TintaUpdateInput) {
        try {
        return await this.prisma.tinta.update({ where: { id }, data });
        } catch (e) {
        return null;
        }
    }

    async delete(id: number) {
        try {
        await this.prisma.tinta.delete({ where: { id } });
        return true;
        } catch (e) {
        return false;
        }
    }
}

export default TintaRepository;