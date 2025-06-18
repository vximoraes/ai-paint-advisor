import { PrismaClient } from '@prisma/client';
import { Usuario } from '../models/Usuario';
import { UsuarioCreateInput, UsuarioUpdateInput, IUsuarioRepository } from '../models/UsuarioTypes';

class UsuarioRepository implements IUsuarioRepository {
    constructor(private prisma: PrismaClient) {}

    async create(data: UsuarioCreateInput): Promise<Usuario> {
        return this.prisma.usuario.create({ data });
    }

    async findAll(): Promise<Usuario[]> {
        return this.prisma.usuario.findMany();
    }

    async findById(id: number): Promise<Usuario | null> {
        return this.prisma.usuario.findUnique({ where: { id } });
    }

    async findByEmail(email: string): Promise<Usuario | null> {
        return this.prisma.usuario.findUnique({ where: { email } });
    }

    async update(id: number, data: UsuarioUpdateInput): Promise<Usuario> {
        return this.prisma.usuario.update({ where: { id }, data });
    }

    async delete(id: number): Promise<boolean> {
        try {
            await this.prisma.usuario.delete({ where: { id } });
            return true;
        } catch (e) {
            return false;
        }
    }
}

export default UsuarioRepository;