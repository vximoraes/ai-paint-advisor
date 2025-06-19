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