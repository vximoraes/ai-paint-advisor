import { ChatService } from "../services/ChatService";
import { Request, Response } from "express";

const chatService = new ChatService();

export class ChatController {
    /**
     * Processa uma requisição de chat, validando a pergunta e retornando a resposta do serviço de IA.
     *
     * @param {Request} req - Objeto de requisição Express contendo a pergunta do usuário.
     * @param {Response} res - Objeto de resposta Express para envio do resultado.
     * @returns {Promise<Response>} - Resposta HTTP com a resposta do modelo ou erro de validação.
     */
    async handleChat(req: Request, res: Response) {
        try {
            const { question } = req.body;
            if (!question || typeof question !== "string" || !question.trim()) {
                return res.status(400).json({ error: "Pergunta inválida." });
            }

            const answer = await chatService.ask(question);
            return res.status(200).json({ answer });
        } catch (err) {
            return res.status(500).json({ error: "Erro ao processar a pergunta." });
        }
    }

    /**
     * Inicia o processo de reindexação das tintas de forma assíncrona.
     *
     * @param {Request} req - Objeto de requisição Express.
     * @param {Response} res - Objeto de resposta Express.
     * @returns {Promise<Response>} - Resposta HTTP informando que o processo foi iniciado.
     */
    async handleReindex(req: Request, res: Response) {
        chatService.reindexPaints().catch((err) => {
            console.error("Erro ao reindexar tintas:", err);
        });
        
        return res.status(202).json({ message: "Re-indexing process started." });
    }
}