import { DynamicTool } from "@langchain/core/tools";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { chatOpenAI } from "../config/openai";
import { paintExpertPrompt } from "../prompts/paintExpertPrompt";

/**
 * Factory que retorna a ferramenta 'paint_recommender' para recomendações técnicas de tintas Suvinil.
 *
 * Esta ferramenta utiliza um chain RAG (Retrieve-And-Generate):
 * - Recupera contexto relevante do catálogo de tintas usando o retriever.
 * - Monta o prompt especializado para o LLM responder como um especialista em tintas Suvinil.
 * - Retorna uma resposta personalizada e contextualizada para perguntas técnicas ou de recomendação.
 *
 * @param retriever - Instância responsável por buscar contexto relevante no catálogo de tintas.
 * @returns DynamicTool Ferramenta pronta para ser usada pelo agente orquestrador.
 *
 * @example
 * const tool = createPaintRecommenderTool(retriever);
 * const resposta = await tool.func("Quero uma tinta lavável para quarto de bebê");
 * console.log(resposta);
 */
export function createPaintRecommenderTool(retriever: any) {
    return new DynamicTool({
        name: "paint_recommender",
        description:
            "Útil para responder perguntas e fornecer recomendações sobre tintas Suvinil, incluindo cores, tipos de parede, ambientes, acabamentos e características como 'lavável' ou 'anti-mofo'.",
        func: async (input: string) => {
            const ragChain = RunnableSequence.from([
                async (input: string) => {
                    const docs = await retriever.invoke(input);
                    return {
                        context: Array.isArray(docs)
                            ? docs.map((d) => d.pageContent || d.content || d.text).join("\n")
                            : docs,
                        question: input,
                    };
                },
                paintExpertPrompt,
                async (input: any) => chatOpenAI.invoke(input),
                async (output: any) => new StringOutputParser().invoke(output),
            ]);
            return await ragChain.invoke(input);
        },
    });
}