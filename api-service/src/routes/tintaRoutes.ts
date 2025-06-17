import { Router } from 'express';
import TintaController from '../controllers/TintaController';
import asyncWrapper from '../utils/asyncWrapper';
import TintaRepository from '../repositories/TintaRepository';
import { TintaService } from '../services/TintaService';
import prisma from '../config/database';

const router = Router();

const repository = new TintaRepository(prisma);
const service = new TintaService(repository);
const controller = new TintaController(service);

router.post('/tintas', asyncWrapper(controller.create.bind(controller)));
router.get('/tintas', asyncWrapper(controller.findAll.bind(controller)));
router.get('/tintas/:id', asyncWrapper(controller.findById.bind(controller)));
router.patch('/tintas/:id', asyncWrapper(controller.update.bind(controller)));
router.delete('/tintas/:id', asyncWrapper(controller.delete.bind(controller)));

export default router;