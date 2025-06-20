import { PrismaClient } from "@prisma/client";
import { OpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config();

const prisma = new PrismaClient();

const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-3-small",
    openAIApiKey: process.env.OPENAI_API_KEY,
});

/**
 * Gera embeddings para todas as tintas do banco e salva no vector store FAISS.
 *
 * Este script é utilizado para reindexar os dados de tintas, permitindo buscas semânticas eficientes.
 *
 * @returns {Promise<void>} Promise resolvida ao final do processo.
 */
export async function generateEmbeddings(): Promise<void> {
    // Busca todas as tintas no banco
    const tintas = await prisma.tinta.findMany();
    console.log('Total de tintas encontradas no banco:', tintas.length);
    if (tintas.length > 0) {
        console.log('IDs das tintas:', tintas.map((t: { id: number }) => t.id));
    }

    if (!tintas || tintas.length === 0) {
        console.error("Nenhuma tinta encontrada no banco de dados.");
        return;
    }

    // Formata cada tinta em uma string descritiva para gerar os embeddings
    const documents = tintas.map((tinta: {
        nome: string;
        cor: string;
        acabamento: string;
        tipo_parede: string;
        ambiente: string;
        linha: string;
        features?: string;
    }) => {
        return `Nome da tinta: ${tinta.nome}. Cor: ${tinta.cor}. Acabamento: ${tinta.acabamento}. Ideal para: ${tinta.tipo_parede}. Ambiente de uso: ${tinta.ambiente}. Características principais: ${tinta.features || "N/A"}. Linha do produto: ${tinta.linha}.`;
    });

    // Garante que o diretório do vector store existe
    const vectorStoreDir = path.resolve(__dirname, "../../src/vector-store");
    if (!fs.existsSync(vectorStoreDir)) {
        fs.mkdirSync(vectorStoreDir, { recursive: true });
    }

    // Cria metadados para cada tinta
    const metadatas = tintas.map((tinta: {
        id: number;
        nome: string;
        cor: string;
        acabamento: string;
        linha: string;
    }) => ({
        id: tinta.id,
        nome: tinta.nome,
        cor: tinta.cor,
        acabamento: tinta.acabamento,
        linha: tinta.linha,
    }));

    // Gera o vector store a partir dos textos e salva
    const vectorStore = await FaissStore.fromTexts(documents, metadatas, embeddings);
    await vectorStore.save(vectorStoreDir);

    console.log(`Vector store salvo em: ${vectorStoreDir}`);
}

/**
 * Bloco autoexecutável para uso via CLI.
 * Executa a geração de embeddings quando o script é chamado diretamente.
 */
if (require.main === module) {
    (async () => {
        try {
            await generateEmbeddings();
        } catch (error) {
            console.error("Erro ao gerar embeddings:", error);
            process.exit(1);
        } finally {
            await prisma.$disconnect();
        }
    })();
}