import { z } from 'zod';

export const UsuarioCreateSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('E-mail inválido'),
    senha: z.string()
        .min(8, 'A senha deve ter pelo menos 8 caracteres')
        .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
        .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
        .regex(/[^A-Za-z0-9]/, 'A senha deve conter pelo menos um caractere especial'),
    role: z.enum(['USER', 'ADMIN']).optional(),
});

export const UsuarioUpdateSchema = UsuarioCreateSchema.partial();

export const UsuarioIdSchema = z.object({
    id: z.coerce.number().int().positive('ID deve ser um número positivo'),
});