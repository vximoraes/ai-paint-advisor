import TintaRepository from '../repositories/tintaRepository';
import { Tinta } from '../models/Tinta';

export class TintaService {
    private tintaRepository: TintaRepository;

    constructor() {
        this.tintaRepository = new TintaRepository();
    }

    async getAllTintas(): Promise<Tinta[]> {
        return this.tintaRepository.findAll();
    }

    async getTintaById(id: number): Promise<Tinta | null> {
        return this.tintaRepository.findById(id);
    }

    async createTinta(data: Omit<Tinta, 'id'>): Promise<Tinta> {
        return this.tintaRepository.create(data);
    }
}

export default TintaService;