import { z } from 'zod';

export const TintaCreateSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    cor: z.string().min(1, 'Cor é obrigatória'),
    tipo_parede: z.string().min(1, 'Tipo de parede é obrigatório'),
    ambiente: z.string().min(1, 'Ambiente é obrigatório'),
    acabamento: z.string().min(1, 'Acabamento é obrigatório'),
    features: z.string().min(1, 'Features são obrigatórias'),
    linha: z.string().min(1, 'Linha é obrigatória'),
});

export const TintaUpdateSchema = TintaCreateSchema.partial();

export const TintaIdSchema = z.object({
    id: z.coerce.number().int().positive('ID deve ser um número positivo'),
});