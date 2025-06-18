import { Router } from 'express';
import UsuarioController from '../controllers/UsuarioController';
import asyncWrapper from '../utils/asyncWrapper';
import UsuarioRepository from '../repositories/UsuarioRepository';
import UsuarioService from '../services/UsuarioService';
import prisma from '../config/database';

const router = Router();

const repository = new UsuarioRepository(prisma);
const service = new UsuarioService(repository);
const controller = new UsuarioController(service);

router
    .post('/usuarios', asyncWrapper(controller.create.bind(controller)));
    .get('/usuarios', asyncWrapper(controller.findAll.bind(controller)));
    .get('/usuarios/:id', asyncWrapper(controller.findById.bind(controller)));
    .patch('/usuarios/:id', asyncWrapper(controller.update.bind(controller)));
    .delete('/usuarios/:id', asyncWrapper(controller.delete.bind(controller)));

export default router;
