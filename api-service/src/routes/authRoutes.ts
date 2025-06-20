import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import UsuarioRepository from '../repositories/UsuarioRepository';
import AuthService from '../services/AuthService';
import prisma from '../config/database';
import asyncWrapper from '../utils/asyncWrapper';

const router = Router();

const usuarioRepository = new UsuarioRepository(prisma);
const authService = new AuthService(usuarioRepository);
const authController = new AuthController(authService);

router
    .post('/login', asyncWrapper(authController.login.bind(authController)));

export default router;

/**
 * @openapi
 * /login:
 *   post:
 *     tags:
 *       - Autenticação
 *     summary: Realiza login
 *     description: Gera um token JWT para autenticação de usuários.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@email.com"
 *               password:
 *                 type: string
 *                 example: "Senha@Forte123"
 *     responses:
 *       '200':
 *         description: Login realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       '400':
 *         description: Dados inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Credenciais inválidas.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */