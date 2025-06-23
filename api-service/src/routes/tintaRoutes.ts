import { Router } from 'express';
import TintaController from '../controllers/TintaController';
import asyncWrapper from '../utils/asyncWrapper';
import TintaRepository from '../repositories/TintaRepository';
import { TintaService } from '../services/TintaService';
import prisma from '../config/database';
import authMiddleware from '../middlewares/authMiddleware';
import { checkRole } from '../middlewares/checkRole';

const router = Router();

const repository = new TintaRepository(prisma);
const service = new TintaService(repository);
const controller = new TintaController(service);

// Rotas públicas
router
    .get('/tintas', asyncWrapper(controller.findAll.bind(controller)))
    .get('/tintas/:id', asyncWrapper(controller.findById.bind(controller)))

// Rotas protegidas (apenas ADMIN)
    .post('/tintas', authMiddleware, checkRole(['ADMIN']), asyncWrapper(controller.create.bind(controller)))
    .patch('/tintas/:id', authMiddleware, checkRole(['ADMIN']), asyncWrapper(controller.update.bind(controller)))
    .delete('/tintas/:id', authMiddleware, checkRole(['ADMIN']), asyncWrapper(controller.delete.bind(controller)))

export default router;

/**
 * @openapi
 * /tintas:
 *   get:
 *     tags:
 *       - Tintas
 *     summary: Lista todas as tintas
 *     description: Retorna uma lista de todas as tintas cadastradas.
 *     responses:
 *       '200':
 *         description: Lista de tintas retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tinta'
 *       '500':
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @openapi
 * /tintas/{id}:
 *   get:
 *     tags:
 *       - Tintas
 *     summary: Busca uma tinta por ID
 *     description: Retorna os detalhes de uma tinta específica pelo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tinta
 *     responses:
 *       '200':
 *         description: Tinta encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tinta'
 *       '404':
 *         description: Tinta não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @openapi
 * /tintas:
 *   post:
 *     tags:
 *       - Tintas
 *     summary: Cria uma nova tinta
 *     description: Endpoint para adicionar uma nova tinta ao catálogo. Requer autenticação de ADMIN.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TintaInput'
 *     responses:
 *       '201':
 *         description: Tinta criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tinta'
 *       '400':
 *         description: Dados inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Não autorizado (token inválido ou ausente).
 *       '403':
 *         description: Acesso negado (usuário não é ADMIN).
 */
/**
 * @openapi
 * /tintas/{id}:
 *   patch:
 *     tags:
 *       - Tintas
 *     summary: Atualiza uma tinta
 *     description: Atualiza os dados de uma tinta existente. Requer autenticação de ADMIN.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tinta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TintaInput'
 *     responses:
 *       '200':
 *         description: Tinta atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tinta'
 *       '400':
 *         description: Dados inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Não autorizado (token inválido ou ausente).
 *       '403':
 *         description: Acesso negado (usuário não é ADMIN).
 *       '404':
 *         description: Tinta não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @openapi
 * /tintas/{id}:
 *   delete:
 *     tags:
 *       - Tintas
 *     summary: Remove uma tinta
 *     description: Remove uma tinta do catálogo. Requer autenticação de ADMIN.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tinta
 *     responses:
 *       '204':
 *         description: Tinta removida com sucesso.
 *       '401':
 *         description: Não autorizado (token inválido ou ausente).
 *       '403':
 *         description: Acesso negado (usuário não é ADMIN).
 *       '404':
 *         description: Tinta não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */