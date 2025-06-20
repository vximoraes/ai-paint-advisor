import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { tintaSeed } from '../api-service/src/seeds/tintaSeed';
import { adminSeed } from '../api-service/src/seeds/adminSeed';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
    console.log('--- Iniciando processo de seed completo ---');

    await tintaSeed(prisma);
    await adminSeed(prisma);

    console.log('--- Processo de seed finalizado com sucesso ---');
}

main()
    .catch((e) => {
        console.error('Ocorreu um erro durante o processo de seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
