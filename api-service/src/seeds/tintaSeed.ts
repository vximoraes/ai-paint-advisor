import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';

export async function tintaSeed(prisma: PrismaClient) {
    console.log('Iniciando sincronização das tintas (Upsert)...');

    const results: any[] = [];
    const csvPath = path.resolve(__dirname, '../../data/Base_de_Dados_de_Tintas_Suvinil.csv');

    await new Promise<void>((resolve, reject) => {
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', resolve)
            .on('error', reject);
    });

    console.log(`Encontradas ${results.length} tintas no CSV. Sincronizando com o banco...`);
    
    for (const row of results) {
        const tintaData = {
            cor: row.cor,
            tipo_parede: row.tipo_parede,
            ambiente: row.ambiente,
            acabamento: row.acabamento,
            features: row.features,
            linha: row.linha,
        };
        await prisma.tinta.upsert({
            where: { nome: row.nome },
            update: tintaData,
            create: { nome: row.nome, ...tintaData },
        });
    }

    console.log('Sincronização de tintas concluída com sucesso!');
}