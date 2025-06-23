import axios from 'axios';
import TintaService from '../../../api-service/src/services/TintaService';
import { ITintaRepository, TintaCreateInput } from '../../../api-service/src/models/TintaTypes';

// Mocka o módulo axios para evitar chamadas HTTP reais
jest.mock('axios');

// Cria um mock do repositório de tintas para isolar a lógica do service
const mockRepository = {
    findAll: jest.fn().mockResolvedValue([]), // Sempre retorna array vazio por padrão
    create: jest.fn(), // Mock do método de criação
};

describe('TintaService', () => {
    let service: TintaService;
    let consoleErrorSpy: jest.SpyInstance;

    // Suprime logs de erro para não poluir a saída dos testes
    beforeAll(() => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        consoleErrorSpy.mockRestore();
    });

    // Garante ambiente limpo e mocks a cada teste
    beforeEach(() => {
        jest.clearAllMocks();
        service = new TintaService(mockRepository as unknown as ITintaRepository);
    });

    describe('create', () => {
        it('deve criar uma nova tinta se não houver duplicidade', async () => {
            // Arrange: prepara mocks e input
            const tintaInput: TintaCreateInput = { nome: 'Azul Oceano', cor: 'Azul', acabamento: 'Fosco', ambiente: 'Externo', tipo_parede: 'Alvenaria', linha: 'Premium' } as any;
            mockRepository.findAll.mockResolvedValue([]); // Nenhuma tinta existente
            mockRepository.create.mockResolvedValue({ id: 1, ...tintaInput });
            (axios.post as jest.Mock).mockResolvedValue({}); // Mocka notificação para AI

            // Act: executa o método
            const result = await service.create(tintaInput);

            // Assert: verifica chamadas e retorno
            expect(mockRepository.findAll).toHaveBeenCalled();
            expect(mockRepository.create).toHaveBeenCalledWith(tintaInput);
            expect(axios.post).toHaveBeenCalled();
            expect(result).toEqual({ id: 1, ...tintaInput });
        });

        it('deve retornar erro se já existir tinta com o mesmo nome', async () => {
            // Arrange: prepara mocks e input duplicado
            const tintaInput: TintaCreateInput = { nome: 'Azul Oceano', cor: 'Azul', acabamento: 'Fosco', ambiente: 'Externo', tipo_parede: 'Alvenaria', linha: 'Premium' } as any;
            mockRepository.findAll.mockResolvedValue([{ id: 1, nome: 'Azul Oceano' }]); // Simula duplicidade

            // Act: executa o método
            const result = await service.create(tintaInput);

            // Assert: espera erro, sem criar nem notificar
            expect(result).toEqual({ error: 'Já existe uma tinta com esse nome' });
            expect(mockRepository.create).not.toHaveBeenCalled();
            expect(axios.post).not.toHaveBeenCalled();
        });
    });
});