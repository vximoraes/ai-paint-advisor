import { PrismaClient } from '@prisma/client';
import { Tinta } from '../models/Tinta';
import { TintaCreateInput, TintaUpdateInput, ITintaRepository } from '../models/TintaTypes';
import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://ai:4001/reindex';

export class TintaRepository implements ITintaRepository {
    constructor(private prisma: PrismaClient) {}

    private async reindexEmbeddings() {
        try {
            await axios.post(AI_SERVICE_URL);
        } catch (err) {
            if (err instanceof Error) {
                const anyErr = err as any;
                console.error('Erro ao reindexar embeddings:', anyErr?.response?.data || err.message);
            } else {
                console.error('Erro ao reindexar embeddings:', err);
            }
        }
    }

    async create(data: TintaCreateInput) {
        const result = await this.prisma.tinta.create({ data });
        await this.reindexEmbeddings();
        return result;
    }

    async findAll() {
        return this.prisma.tinta.findMany({ orderBy: { id: 'asc' } });
    }

    async findById(id: number) {
        return this.prisma.tinta.findUnique({ where: { id } });
    }

    async update(id: number, data: TintaUpdateInput) {
        try {
            const result = await this.prisma.tinta.update({ where: { id }, data });
            await this.reindexEmbeddings();
            return result;
        } catch (e) {
            return null;
        }
    }

    async delete(id: number) {
        try {
            await this.prisma.tinta.delete({ where: { id } });
            await this.reindexEmbeddings();
            return true;
        } catch (e) {
            return false;
        }
    }
}

export default TintaRepository;