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