import { IUsuarioRepository, UsuarioCreateInput, UsuarioUpdateInput } from '../models/UsuarioTypes';
import bcrypt from 'bcrypt';

class UsuarioService {
    private usuarioRepository: IUsuarioRepository;
    constructor(usuarioRepository: IUsuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    async create(data: UsuarioCreateInput) {
        const existing = await this.usuarioRepository.findByEmail(data.email);
        if (existing) {
            return { error: 'E-mail já cadastrado.' };
        }

        const hashedSenha = await bcrypt.hash(data.senha, 10);

        const usuario = await this.usuarioRepository.create({
            ...data,
            senha: hashedSenha,
            role: 'USER', // Sempre força USER
        });

        const { senha, ...userWithoutSenha } = usuario as any;
        return userWithoutSenha;
    }

    async findAll() {
        const users = await this.usuarioRepository.findAll();
        return users.map(({ senha, ...u }: any) => u);
    }

    async findById(id: number) {
        const user = await this.usuarioRepository.findById(id);
        if (!user) return null;
        
        const { senha, ...userWithoutSenha } = user as any;
        return userWithoutSenha;
    }

    async update(id: number, data: UsuarioUpdateInput) {
        if (data.senha) {
            data.senha = await bcrypt.hash(data.senha, 10);
        }

        try {
            const user = await this.usuarioRepository.update(id, data);
            const { senha, ...userWithoutSenha } = user as any;
            return userWithoutSenha;
        } catch (e) {
            return { error: 'Usuário não encontrado' };
        }
    }

    async delete(id: number) {
        const user = await this.usuarioRepository.delete(id);
        return user;
    }
}

export default UsuarioService;