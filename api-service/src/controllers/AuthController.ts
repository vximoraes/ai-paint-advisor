import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
import { LoginSchema } from '../utils/validators/schemas/authSchema';

class AuthController {
    private authService: AuthService;
    constructor(authService: AuthService) {
        this.authService = authService;
    }

    async login(req: Request, res: Response) {
        try {
            const parsed = LoginSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ error: parsed.error.errors });
            }

            const token = await this.authService.login(parsed.data.email, parsed.data.password);
            return res.json({ token });
        } catch (err: any) {
            return res.status(401).json({ error: err.message || 'Credenciais inválidas' });
        }
    }
}

export default AuthController;