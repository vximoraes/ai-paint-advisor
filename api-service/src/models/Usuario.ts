export interface Usuario {
    id: number;
    nome: string;
    email: string;
    senha: string;
    role: 'USER' | 'ADMIN';
    createdAt: Date;
};