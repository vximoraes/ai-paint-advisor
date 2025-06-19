import { ITintaRepository, TintaCreateInput, TintaUpdateInput } from '../models/TintaTypes';
import { Tinta } from '../models/Tinta';

export class TintaService {
    private repository: ITintaRepository;

    constructor(repository: ITintaRepository) {
        this.repository = repository;
    }

    async create(data: TintaCreateInput) {
        const all = await this.repository.findAll();
        if (all.some((tinta: Tinta) => tinta.nome === data.nome)) {
            return { error: 'Já existe uma tinta com esse nome' };
        }
        return this.repository.create(data);
    }

    async findAll() {
        return this.repository.findAll();
    }

    async findById(id: number) {
        return this.repository.findById(id);
    }

    async update(id: number, data: TintaUpdateInput) {
        return this.repository.update(id, data);
    }

    async delete(id: number) {
        return this.repository.delete(id);
    }
}

export default TintaService;