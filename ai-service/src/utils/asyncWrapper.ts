import { Request, Response, NextFunction } from "express";

/**
 * Wrapper para lidar com funções assíncronas em rotas Express.
 *
 * Permite que erros lançados em funções async sejam capturados e encaminhados ao middleware de erro do Express,
 * evitando a necessidade de múltiplos blocos try/catch em cada rota.
 *
 * @param {(req: Request, res: Response, next: NextFunction) => Promise<any>} fn - Função assíncrona de rota Express.
 * @returns {(req: Request, res: Response, next: NextFunction) => void} - Função Express que executa a função assíncrona e encaminha erros ao next().
 */
export function asyncWrapper(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
}