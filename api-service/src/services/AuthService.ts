import UsuarioRepository from '../repositories/UsuarioRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET não definido nas variáveis de ambiente');

class AuthService {
    private usuarioRepository: UsuarioRepository;
    constructor(usuarioRepository: UsuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    async login(email: string, senha: string) {
        const user = await this.usuarioRepository.findByEmail(email);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const valid = await bcrypt.compare(senha, user.senha);
        if (!valid) {
            throw new Error('Senha inválida');
        }

        // Inclui a role no payload do JWT
        const payload = { id: user.id, role: user.role };
        const token = jwt.sign(payload, JWT_SECRET as string, { expiresIn: '1d' });
        return token;
    }
}

export default AuthService;