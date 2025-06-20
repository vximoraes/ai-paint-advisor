import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

export const chatOpenAI = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.2,
});

export const openaiEmbeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-3-small",
    openAIApiKey: process.env.OPENAI_API_KEY,
});