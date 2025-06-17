import { Tinta } from '../models/Tinta';
import { tintaRepository } from '../repositories/tintaRepository';

export const tintaService = {
    getAllTintas: async (): Promise<Tinta[]> => {
        return tintaRepository.findAll();
    },
    getTintaById: async (id: number): Promise<Tinta | null> => {
        return tintaRepository.findById(id);
    },
    createTinta: async (data: Omit<Tinta, 'id'>): Promise<Tinta> => {
        return tintaRepository.create(data);
    },
};