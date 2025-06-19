import { Request, Response, NextFunction } from 'express';

// Middleware para checar se o usuário tem um dos papéis permitidos
export const checkRole = (allowedRoles: Array<string>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = (req as any).user?.role;
        if (userRole && allowedRoles.includes(userRole)) {
            return next();
        }
        
        return res.status(403).json({ message: 'Acesso negado: permissão insuficiente.' });
    };
};
