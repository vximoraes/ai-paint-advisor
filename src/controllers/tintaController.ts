import { Request, Response } from 'express';
import { TintaService } from '../services/tintaService';
import { PrismaClient } from '@prisma/client';
import { TintaRepository } from '../repositories/tintaRepository';

export class TintaController {
    private tintaService: TintaService;

    constructor() {
        this.tintaService = new TintaService();
    }

    getAllTintas = async (req: Request, res: Response) => {
        const tintas = await this.tintaService.getAllTintas();
        res.json(tintas);
    };

    getTintaById = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const tinta = await this.tintaService.getTintaById(id);
        if (tinta) res.json(tinta);
        else res.status(404).json({ message: 'Tinta não encontrada' });
    };

    createTinta = async (req: Request, res: Response) => {
        const { nome, cor, tipo_parede, ambiente, acabamento, features, linha } = req.body;
        if (
            !nome || !cor || !tipo_parede || !ambiente ||
            !acabamento || !features || !linha
        ) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }
        const tinta = await this.tintaService.createTinta({ nome, cor, tipo_parede, ambiente, acabamento, features, linha });
        res.status(201).json(tinta);
    };
}

export default TintaController;