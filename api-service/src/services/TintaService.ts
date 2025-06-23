import { ITintaRepository, TintaCreateInput, TintaUpdateInput } from '../models/TintaTypes';
import { Tinta } from '../models/Tinta';
import axios from 'axios';

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
        const result = await this.repository.create(data);
        this._notifyAIReindex();
        return result;
    }

    async findAll() {
        return this.repository.findAll();
    }

    async findById(id: number) {
        return this.repository.findById(id);
    }

    async update(id: number, data: TintaUpdateInput) {
        const result = await this.repository.update(id, data);
        this._notifyAIReindex();
        return result;
    }

    async delete(id: number) {
        const result = await this.repository.delete(id);
        this._notifyAIReindex();
        return result;
    }

    private async _notifyAIReindex() {
        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:4001/reindex';
        try {
            await axios.post(aiServiceUrl);
        } catch (err: any) {
            console.error('Erro ao notificar ai-service para reindexação:', err && err.message ? err.message : err);
        }
    }
}

export default TintaService;