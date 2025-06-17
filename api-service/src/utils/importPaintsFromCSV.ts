import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';

const prisma = new PrismaClient();

async function main() {
    const results: any[] = [];
    const csvPath = path.resolve(__dirname, '../../data/Base_de_Dados_de_Tintas_Suvinil.csv');

    await new Promise<void>((resolve, reject) => {
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', resolve)
            .on('error', reject);
    });

    // Deleta todos os registros antes de inserir.
    await prisma.tinta.deleteMany({});

    // Reseta o autoincremento do id.
    await prisma.$executeRawUnsafe('ALTER SEQUENCE "Tinta_id_seq" RESTART WITH 1;');

    for (const row of results) {
        await prisma.tinta.create({
            data: {
                nome: row.nome,
                cor: row.cor,
                tipo_parede: row.tipo_parede,
                ambiente: row.ambiente,
                acabamento: row.acabamento,
                features: row.features,
                linha: row.linha,
            },
        });
    }
    console.log('Importação concluída!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });