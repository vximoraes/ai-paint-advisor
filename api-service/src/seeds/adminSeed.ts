import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
    console.log('Iniciando seed do usuário admin...');

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        console.error('ADMIN_EMAIL e ADMIN_PASSWORD devem estar definidos no seu arquivo .env.');
        process.exit(1);
    }

    const existingAdmin = await prisma.usuario.findUnique({
        where: { email: adminEmail },
    });

    if (existingAdmin) {
        console.log('Usuário admin já existe.');
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

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });