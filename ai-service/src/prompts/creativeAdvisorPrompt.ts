import { ChatPromptTemplate } from "@langchain/core/prompts";

/**
 * Prompt para o consultor criativo de design de interiores.
 *
 * Este prompt instrui o LLM a agir como um especialista em decoração, fornecendo dicas inspiradoras,
 * sugestões de harmonização de cores, tendências e ideias para ambientes, de forma criativa e personalizada.
 * Utilizado pela ferramenta 'creative_advisor' para responder perguntas que não envolvem produtos específicos.
 */
export const creativeAdvisorPrompt = ChatPromptTemplate.fromTemplate(
    `Você é um consultor criativo de design de interiores.\nDê conselhos inspiradores, dicas de harmonização de cores, tendências e ideias de decoração.\nPergunta do usuário: {input}`
);