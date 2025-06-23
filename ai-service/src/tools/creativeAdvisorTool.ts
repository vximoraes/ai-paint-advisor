import { DynamicTool } from "@langchain/core/tools";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { chatOpenAI } from "../config/openai";
import { creativeAdvisorPrompt } from "../prompts/creativeAdvisorPrompt";

/**
 * Ferramenta 'creative_advisor' para conselhos de decoração e inspiração.
 *
 * Esta ferramenta utiliza um prompt criativo para o LLM agir como consultor de design de interiores,
 * fornecendo dicas de harmonização de cores, tendências e ideias de decoração para ambientes.
 * É acionada pelo agente orquestrador quando a pergunta do usuário não envolve produtos específicos.
 */
export const creativeAdvisorTool = new DynamicTool({
    name: "creative_advisor",
    description:
        "Útil para quando o usuário pedir conselhos gerais sobre decoração, harmonização de cores, tendências, estilos de pintura ou inspiração, que não sejam sobre um produto específico.",
    func: async (input: string) => {
        const chain = RunnableSequence.from([
            async (input: string) => ({ input }),
            creativeAdvisorPrompt,
            async (input: any) => chatOpenAI.invoke(input),
            async (output: any) => new StringOutputParser().invoke(output),
        ]);
        return await chain.invoke(input);
    },
});