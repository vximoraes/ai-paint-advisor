import { PromptTemplate } from "@langchain/core/prompts";

/**
 * PromptTemplate dedicado para enriquecer a descrição enviada ao DALL-E.
 *
 * Este prompt gera uma instrução detalhada para a API de geração de imagens,
 * garantindo que a cena seja realista, bem iluminada e com elementos de escala e estilo.
 *
 * Variáveis de entrada:
 * - description: descrição textual do ambiente e da cor desejada pelo usuário.
 *
 * Exemplo de uso:
 * @example
 * const prompt = await dallePrompt.format({ description: "um escritório moderno com paredes na cor Cinza Urbano" });
 */
const dallePrompt = new PromptTemplate({
    inputVariables: ["description"],
    template:
        "Uma foto realista de alta qualidade de {description}. O ambiente deve ser bem iluminado, mostrando a textura da tinta na parede. Inclua móveis simples e decoração minimalista para dar uma sensação de escala e estilo.",
});

export default dallePrompt;