import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { openaiEmbeddings } from "../config/openai";
import { buildTintaAdvisorAgentExecutor } from "../chains/buildTintaAdvisorChain";
import path from "path";
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

export class ChatService {
    private agentExecutor: any;
    private initializing: Promise<void>;
    private prisma = new PrismaClient();
    private chatHistory: any[] = [];

    constructor() {
        const vectorStorePath = path.resolve(process.cwd(), "src/vector-store");
        this.initializing = FaissStore.load(vectorStorePath, openaiEmbeddings)
            .then(async (vectorStore: any) => {
                const retriever = vectorStore.asRetriever();
                this.agentExecutor = await buildTintaAdvisorAgentExecutor(retriever);
            })
            .catch(async (err: any) => {
                // Se falhar ao carregar, tenta reindexar automaticamente.
                console.warn("Vector store inválido ou ausente. Gerando novamente...");
                await this.reindexPaints();
            });
    }

    /**
     * Realiza uma pergunta ao sistema de agentes, mantendo o histórico de chat.
     * Aguarda a inicialização do agent executor caso ainda não esteja pronto.
     *
     * @param {string} question - Pergunta do usuário.
     * @returns {Promise<string>} - Resposta gerada pelo agente.
     */
    async ask(question: string): Promise<string> {
        if (!this.agentExecutor) {
            await this.initializing;
        }

        // Monta o input com histórico
        const input = {
            input: question,
            chat_history: this.chatHistory,
        };

        const response = await this.agentExecutor.invoke(input);

        // Atualiza o histórico
        this.chatHistory.push({ role: "human", content: question });
        this.chatHistory.push({ role: "ai", content: response.output });

        return response.output;
    }

    /**
     * Reindexa todas as tintas do banco e atualiza o vector store FAISS.
     * Utilizado para garantir que o sistema de busca esteja sincronizado com o banco de dados.
     *
     * @returns {Promise<void>} - Promessa resolvida ao final da reindexação.
     */
    public async reindexPaints(): Promise<void> {
        // Busca todas as tintas no banco
        const tintas = await this.prisma.tinta.findMany();
        if (!tintas || tintas.length === 0) {
            console.error("Nenhuma tinta encontrada no banco de dados.");
            return;
        }

        // Formata cada tinta em uma string descritiva
        const documents = tintas.map((tinta: any) =>
            `Nome da tinta: ${tinta.nome}. Cor: ${tinta.cor}. Acabamento: ${tinta.acabamento}. Ideal para: ${tinta.tipo_parede}. Ambiente de uso: ${tinta.ambiente}. Características principais: ${tinta.features || "N/A"}. Linha do produto: ${tinta.linha}.`
        );

        // Garante que o diretório existe
        const vectorStoreDir = path.join(__dirname, "../vector-store");
        if (!fs.existsSync(vectorStoreDir)) {
            fs.mkdirSync(vectorStoreDir, { recursive: true });
        }

        // Gera e salva o vector store
        const metadatas = tintas.map((tinta: any) => ({
            id: tinta.id,
            nome: tinta.nome,
            cor: tinta.cor,
            acabamento: tinta.acabamento,
            linha: tinta.linha,
        }));

        const vectorStore = await FaissStore.fromTexts(documents, metadatas, openaiEmbeddings);
        await vectorStore.save(vectorStoreDir);
        console.log(`Vector store salvo em: ${vectorStoreDir}`);
        
        // Atualiza o retriever e o agent executor para refletir o novo índice
        this.agentExecutor = await buildTintaAdvisorAgentExecutor(vectorStore.asRetriever());
    }
}