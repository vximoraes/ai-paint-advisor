import UsuarioService from '../../../api-service/src/services/UsuarioService';
import { IUsuarioRepository, UsuarioCreateInput } from '../../../api-service/src/models/UsuarioTypes';
import bcrypt from 'bcrypt';

// Mocka o bcrypt para evitar hash real durante os testes
jest.mock('bcrypt');

// Cria um mock do repositório de usuários para isolar a lógica do service
const mockRepository = {
    findByEmail: jest.fn(), // Mock do método de busca por e-mail
    create: jest.fn(),     // Mock do método de criação
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

describe('UsuarioService', () => {
    let service: UsuarioService;

    // Garante ambiente limpo e mocks a cada teste
    beforeEach(() => {
        jest.clearAllMocks();
        service = new UsuarioService(mockRepository as unknown as IUsuarioRepository);
    });

    describe('create', () => {
        it('deve criar um novo usuário com a role USER e retornar o usuário sem a senha', async () => {
            // Arrange: prepara mocks e input
            const usuarioInput: UsuarioCreateInput = { email: 'teste@exemplo.com', senha: '123456' } as any;
            mockRepository.findByEmail.mockResolvedValue(null); // Não existe usuário com o e-mail
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedsenha'); // Mocka hash da senha
            mockRepository.create.mockResolvedValue({ id: 1, email: 'teste@exemplo.com', senha: 'hashedsenha', role: 'USER' });

            // Act: executa o método
            const result = await service.create(usuarioInput);

            // Assert: verifica chamadas e retorno
            expect(mockRepository.findByEmail).toHaveBeenCalledWith('teste@exemplo.com');
            expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
            expect(mockRepository.create).toHaveBeenCalledWith({ ...usuarioInput, senha: 'hashedsenha', role: 'USER' });
            expect(result).toEqual({ id: 1, email: 'teste@exemplo.com', role: 'USER' });
            expect((result as any).senha).toBeUndefined(); // Garante que a senha não é retornada
        });

        it('deve retornar um erro se o e-mail já estiver cadastrado', async () => {
            // Arrange: prepara mocks e input duplicado
            const usuarioInput: UsuarioCreateInput = { email: 'teste@exemplo.com', senha: '123456' } as any;
            mockRepository.findByEmail.mockResolvedValue({ id: 1, email: 'teste@exemplo.com' }); // Simula e-mail já cadastrado

            // Act: executa o método
            const result = await service.create(usuarioInput);

            // Assert: espera erro e não cria usuário
            expect(result).toEqual({ error: 'E-mail já cadastrado.' });
            expect(mockRepository.create).not.toHaveBeenCalled();
        });
    });
});