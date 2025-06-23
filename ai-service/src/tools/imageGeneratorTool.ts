import { DynamicTool } from "langchain/tools";
import dallePrompt from "../prompts/dallePrompt";
import { chatOpenAI } from "../config/openai";
import OpenAI from "openai";

/**
 * Ferramenta LangChain para geração dinâmica de imagens com DALL-E.
 *
 * Esta ferramenta é utilizada pelo agente para gerar imagens realistas de ambientes pintados,
 * conforme a descrição fornecida pelo usuário. Utiliza o modelo DALL-E da OpenAI, com prompt
 * enriquecido para garantir qualidade visual e contexto decorativo.
 *
 * - name: "image_generator"
 * - description: Útil para quando o usuário pede para ver, visualizar ou gerar uma imagem de como uma tinta ficaria em um ambiente.
 *
 * @example
 * const result = await imageGeneratorTool.func("um escritório moderno com paredes na cor Cinza Urbano");
 * // result: "Aqui está uma simulação de como ficaria: <URL_DA_IMAGEM>"
 */
export const imageGeneratorTool = new DynamicTool({
    name: "image_generator",
    description:
        "Útil para quando o usuário pede para ver, visualizar ou gerar uma imagem de como uma tinta ficaria em um ambiente.",
    func: async (input: string) => {
        try {
            // Formata o prompt para o DALL-E
            const prompt = await dallePrompt.format({ description: input });
            const apiKey = process.env.OPENAI_API_KEY || (chatOpenAI as any).openAIApiKey;
            const openai = new OpenAI({ apiKey });
            
            const response = await openai.images.generate({
                prompt,
                n: 1,
                size: "1024x1024",
                model: "dall-e-2",
            });

            const imageUrl = response.data && response.data[0]?.url;
            if (!imageUrl) throw new Error("Não foi possível gerar a imagem.");

            return `Aqui está uma simulação de como ficaria: ${imageUrl}`;
        } catch (error: any) {
            console.error("Erro ao gerar imagem com DALL-E:", error);
            return "Desculpe, não consegui gerar a imagem no momento.";
        }
    },
});