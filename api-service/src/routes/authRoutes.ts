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