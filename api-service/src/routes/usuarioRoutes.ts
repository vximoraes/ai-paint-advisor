import { Router } from 'express';
import UsuarioController from '../controllers/UsuarioController';
import asyncWrapper from '../utils/asyncWrapper';
import UsuarioRepository from '../repositories/UsuarioRepository';
import UsuarioService from '../services/UsuarioService';
import prisma from '../config/database';
import authMiddleware from '../middlewares/authMiddleware';
import { checkRole } from '../middlewares/checkRole';

const router = Router();

const repository = new UsuarioRepository(prisma);
const service = new UsuarioService(repository);
const controller = new UsuarioController(service);

// Rota pública para criação de novos usuários.
router
    .post('/usuarios', asyncWrapper(controller.create.bind(controller)))

// Rota protegida para ADMIN listar todos os usuários.
    .get('/usuarios', authMiddleware, checkRole(['ADMIN']), asyncWrapper(controller.findAll.bind(controller)))

// Rotas protegidas que exigem login, com lógica de permissão no controller.
    .get('/usuarios/:id', authMiddleware, asyncWrapper(controller.findById.bind(controller)))
    .patch('/usuarios/:id', authMiddleware, asyncWrapper(controller.update.bind(controller)))

// Rota protegida para ADMIN deletar um usuário.
    .delete('/usuarios/:id', authMiddleware, checkRole(['ADMIN']), asyncWrapper(controller.delete.bind(controller)))

export default router;

/**
 * @openapi
 * /usuarios:
 *   post:
 *     tags:
 *       - Usuários
 *     summary: Cria um novo usuário
 *     description: Endpoint público para cadastro de novos usuários.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioInput'
 *     responses:
 *       '201':
 *         description: Usuário criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       '400':
 *         description: Dados inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @openapi
 * /usuarios:
 *   get:
 *     tags:
 *       - Usuários
 *     summary: Lista todos os usuários
 *     description: Retorna uma lista de todos os usuários cadastrados. Requer autenticação de ADMIN.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de usuários retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       '401':
 *         description: Não autorizado (token inválido ou ausente).
 *       '403':
 *         description: Acesso negado (usuário não é ADMIN).
 */
/**
 * @openapi
 * /usuarios/{id}:
 *   get:
 *     tags:
 *       - Usuários
 *     summary: Busca um usuário por ID
 *     description: Retorna os detalhes de um usuário específico pelo ID. Requer autenticação.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       '200':
 *         description: Usuário encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       '401':
 *         description: Não autorizado (token inválido ou ausente).
 *       '404':
 *         description: Usuário não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @openapi
 * /usuarios/{id}:
 *   patch:
 *     tags:
 *       - Usuários
 *     summary: Atualiza um usuário
 *     description: Atualiza os dados de um usuário existente. Requer autenticação.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       '200':
 *         description: Usuário atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       '400':
 *         description: Dados inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Não autorizado (token inválido ou ausente).
 *       '404':
 *         description: Usuário não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @openapi
 * /usuarios/{id}:
 *   delete:
 *     tags:
 *       - Usuários
 *     summary: Remove um usuário
 *     description: Remove um usuário do sistema. Requer autenticação de ADMIN.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       '204':
 *         description: Usuário removido com sucesso.
 *       '401':
 *         description: Não autorizado (token inválido ou ausente).
 *       '403':
 *         description: Acesso negado (usuário não é ADMIN).
 *       '404':
 *         description: Usuário não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */