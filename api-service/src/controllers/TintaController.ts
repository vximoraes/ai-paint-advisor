import { Request, Response } from 'express';
import { TintaCreateSchema, TintaUpdateSchema, TintaIdSchema } from '../utils/validators/schemas/tintaSchema';
import { TintaService } from '../services/TintaService';

export class TintaController {
    private service: TintaService;

    constructor(service: TintaService) {
        this.service = service;
    }

    async create(req: Request, res: Response) {
        const parsed = TintaCreateSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ errors: parsed.error.errors });
        }

        const tinta = await this.service.create(parsed.data);
        if ((tinta as any).error) {
            return res.status(400).json({ message: (tinta as any).error });
        }
        
        res.status(201).json(tinta);
    }

    async findAll(req: Request, res: Response) {
        const tintas = await this.service.findAll();
        res.status(200).json(tintas);
    }

    async findById(req: Request, res: Response) {
        const parsed = TintaIdSchema.safeParse(req.params);
        if (!parsed.success) {
            return res.status(400).json({ errors: parsed.error.errors });
        }
        
        const tinta = await this.service.findById(parsed.data.id);
        if (!tinta) {
            return res.status(404).json({ message: 'Tinta não encontrada' });
        }

        res.status(200).json(tinta);
    }

    async update(req: Request, res: Response) {
        const idParsed = TintaIdSchema.safeParse(req.params);
        if (!idParsed.success) {
            return res.status(400).json({ errors: idParsed.error.errors });
        }

        const bodyParsed = TintaUpdateSchema.safeParse(req.body);
        if (!bodyParsed.success) {
            return res.status(400).json({ errors: bodyParsed.error.errors });
        }

        const tinta = await this.service.update(idParsed.data.id, bodyParsed.data);
        if (!tinta) {
            return res.status(404).json({ message: 'Tinta não encontrada' });
        }

        res.status(200).json(tinta);
    }

    async delete(req: Request, res: Response) {
        const parsed = TintaIdSchema.safeParse(req.params);
        if (!parsed.success) {
            return res.status(400).json({ errors: parsed.error.errors });
        }

        const deleted = await this.service.delete(parsed.data.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Tinta não encontrada' });
        }
        
        res.status(200).json({ message: 'Tinta deletada com sucesso' });
    }
}

export default TintaController;