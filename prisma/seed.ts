import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { tintaSeed } from '../api-service/src/seeds/tintaSeed';
import { adminSeed } from '../api-service/src/seeds/adminSeed';
import axios from 'axios';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
    console.log('--- Iniciando processo de seed completo ---');

    await tintaSeed(prisma);
    await adminSeed(prisma);

    // Notifica o serviço de IA para reindexação
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:4001/reindex';
    try {
        await axios.post(aiServiceUrl);
        console.log('Reindexação do banco vetorial solicitada com sucesso!');
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erro ao notificar ai-service para reindexação:', err.message);
        } else if (typeof err === 'object' && err && 'message' in err) {
            console.error('Erro ao notificar ai-service para reindexação:', (err as any).message);
        } else {
            console.error('Erro ao notificar ai-service para reindexação:', err);
        }
    }

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
