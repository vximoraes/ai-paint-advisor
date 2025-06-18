import { Usuario } from './Usuario';

export type UsuarioCreateInput = Omit<Usuario, 'id' | 'createdAt' | 'role'> & { role?: 'USER' | 'ADMIN' };
export type UsuarioUpdateInput = Partial<UsuarioCreateInput>;

export interface IUsuarioRepository {
    create(data: UsuarioCreateInput): Promise<Usuario>;
    findAll(): Promise<Usuario[]>;
    findById(id: number): Promise<Usuario | null>;
    findByEmail(email: string): Promise<Usuario | null>;
    update(id: number, data: UsuarioUpdateInput): Promise<Usuario>;
    delete(id: number): Promise<boolean>;
}