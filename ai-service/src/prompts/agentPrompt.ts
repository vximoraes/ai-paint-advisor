import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

/**
 * Prompt do agente orquestrador do Loomi Paint Advisor.
 *
 * Este prompt instrui o agente a analisar a pergunta do usuário e escolher entre as ferramentas disponíveis,
 * de acordo com a intenção detectada na mensagem:
 *
 * - 'paint_recommender': Para perguntas sobre produtos Suvinil, recomendações de tintas, tipos de parede, ambientes, acabamentos ou características específicas.
 * - 'creative_advisor': Para conselhos criativos, harmonização de cores, tendências, estilos ou inspiração.
 * - 'image_generator': Se o usuário pedir para "ver", "visualizar", "mostrar como ficaria" ou "gerar uma imagem" de um ambiente pintado.
 *
 * O agente deve manter o contexto da conversa usando o histórico (chat_history) e responder sempre de forma amigável e útil.
 *
 * Exemplo de uso:
 * @example
 * const prompt = agentPrompt.formatMessages({ input: "Quero ver como ficaria minha sala pintada de verde." });
 */
export const agentPrompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        `Você é um agente orquestrador especialista em tintas e decoração.\nAnalise a pergunta do usuário e escolha a melhor ferramenta para responder.\n- Se a pergunta for sobre produtos Suvinil, recomendações de tintas, tipos de parede, ambientes, acabamentos ou características específicas, use a ferramenta 'paint_recommender'.\n- Se a pergunta for sobre dicas criativas, harmonização de cores, tendências, estilos ou inspiração, use a ferramenta 'creative_advisor'.\n- Se o usuário pedir para 'ver', 'visualizar', 'mostrar como ficaria' ou 'gerar uma imagem' de um ambiente pintado, use a ferramenta 'image_generator'.\nMantenha o contexto da conversa usando o histórico (chat_history).\nResponda sempre de forma amigável e útil.\nIMPORTANTE: Se usar a ferramenta 'image_generator', SEMPRE inclua o link da imagem gerada (URL) na resposta final ao usuário, sem modificar ou omitir o link.`
    ],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
    new MessagesPlaceholder("agent_scratchpad"),
]);