import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET não definido nas variáveis de ambiente');

function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET as string);
        (req as any).user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido' });
    }
}

export default authMiddleware;