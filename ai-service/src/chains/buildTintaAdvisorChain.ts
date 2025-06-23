import { createOpenAIToolsAgent, AgentExecutor } from "langchain/agents";
import { chatOpenAI } from "../config/openai";
import { createPaintRecommenderTool } from "../tools/paintRecommenderTool";
import { creativeAdvisorTool } from "../tools/creativeAdvisorTool";
import { agentPrompt } from "../prompts/agentPrompt";
import { imageGeneratorTool } from "../tools/imageGeneratorTool";

/**
 * Cria e retorna um AgentExecutor configurado para o Loomi Paint Advisor.
 *
 * O agente orquestrador utiliza ferramentas especializadas para responder perguntas sobre tintas Suvinil (via RAG)
 * e fornecer conselhos criativos de decoração. O agente analisa a pergunta do usuário e decide qual ferramenta
 * utilizar, mantendo o contexto da conversa através do histórico.
 *
 * @param retriever - Instância responsável por buscar contexto relevante no catálogo de tintas (usada pelo RAG).
 * @returns Promise<AgentExecutor> Executor de agente pronto para ser utilizado no serviço de chat.
 *
 * @example
 * const executor = await buildTintaAdvisorAgentExecutor(retriever);
 * const resposta = await executor.invoke({ input: "Quero pintar o quarto de Azul Céu...", chat_history: [] });
 * console.log(resposta.output);
 */
export async function buildTintaAdvisorAgentExecutor(retriever: any) {
    const paintRecommenderTool = createPaintRecommenderTool(retriever);
    // creativeAdvisorTool não depende do retriever

    const agent = await createOpenAIToolsAgent({
        llm: chatOpenAI as any,
        tools: [paintRecommenderTool, creativeAdvisorTool, imageGeneratorTool],
        prompt: agentPrompt,
    });

    return AgentExecutor.fromAgentAndTools({
        agent,
        tools: [paintRecommenderTool, creativeAdvisorTool, imageGeneratorTool],
        verbose: true,
    });
}