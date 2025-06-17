import { Request, Response } from 'express';
import { tintaService } from '../services/tintaService';

export const getAllTintas = async (req: Request, res: Response) => {
    const tintas = await tintaService.getAllTintas();
    res.json(tintas);
};

export const getTintaById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const tinta = await tintaService.getTintaById(id);
    if (tinta) res.json(tinta);
    else res.status(404).json({ message: 'Tinta não encontrada' });
};

export const createTinta = async (req: Request, res: Response) => {
    const { nome, cor, tipo_parede, ambiente, acabamento, features, linha } = req.body;
    if (
        !nome || !cor || !tipo_parede || !ambiente ||
        !acabamento || !features || !linha
    ) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    const tinta = await tintaService.createTinta({ nome, cor, tipo_parede, ambiente, acabamento, features, linha });
    res.status(201).json(tinta);
};