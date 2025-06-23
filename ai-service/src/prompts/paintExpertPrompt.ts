import { ChatPromptTemplate } from "@langchain/core/prompts";

/**
 * Prompt para o especialista em tintas Suvinil (RAG).
 *
 * Este prompt instrui o LLM a agir como um especialista em tintas Suvinil, utilizando o contexto de produtos
 * recuperado do catálogo para responder perguntas técnicas ou de recomendação de forma amigável e útil.
 * Utilizado pela ferramenta 'paint_recommender' para respostas baseadas em contexto (RAG).
 */
export const paintExpertPrompt = ChatPromptTemplate.fromTemplate(
    `Você é um especialista em tintas da Suvinil.\nUse o contexto de produtos abaixo para responder à pergunta do usuário de forma amigável e útil.\n\nContexto:\n{context}\n\nPergunta:\n{question}\n\nResposta do Especialista:`
);