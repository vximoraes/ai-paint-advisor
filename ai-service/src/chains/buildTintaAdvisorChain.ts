import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { chatOpenAI } from "../config/openai";

/**
 * Constrói a cadeia de execução (chain) para o especialista em tintas Suvinil.
 * Usa um retriever para buscar contexto relevante e um modelo de linguagem para gerar respostas personalizadas.
 *
 * @param {any} retriever - Responsável por recuperar contexto relevante.
 * @returns {RunnableSequence} - Cadeia para processar perguntas e gerar respostas.
 */
export function buildTintaAdvisorChain(retriever: any) {
    const prompt = PromptTemplate.fromTemplate(
        `Você é um especialista em tintas da Suvinil. 
        Use o contexto de produtos abaixo para responder à pergunta do usuário de forma amigável e útil.
        \n\nContexto:\n{context}\n\nPergunta:\n{question}\n\nResposta do Especialista:`
    );

    return RunnableSequence.from([
        // Busca contexto relevante para a pergunta, monta o prompt e chama o modelo.
        async (input: { question: string }) => {
            const docs = await retriever.invoke(input.question);
            return {
                context: Array.isArray(docs)
                    ? docs.map((d) => d.pageContent || d.content || d.text).join("\n")
                    : docs,
                question: input.question,
            };
        },
        prompt,
        async (input: any) => chatOpenAI.invoke(input),
        async (output: any) => new StringOutputParser().invoke(output),
    ]);
}