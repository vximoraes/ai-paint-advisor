import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

export async function adminSeed(prisma: PrismaClient) {
    console.log('Iniciando seed do usuário admin...');

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        console.error('ADMIN_EMAIL e ADMIN_PASSWORD devem estar definidos no .env.');
        return;
    }

    const existingAdmin = await prisma.usuario.findUnique({
        where: { email: adminEmail },
    });

    if (existingAdmin) {
        console.warn('Já existe um usuário com o e-mail do admin. Nenhuma alteração foi feita por segurança.');
        return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.usuario.create({
        data: {
            nome: 'Admin',
            email: adminEmail,
            senha: hashedPassword,
            role: Role.ADMIN,
        },
    });

    console.log('Usuário admin criado com sucesso!');
}