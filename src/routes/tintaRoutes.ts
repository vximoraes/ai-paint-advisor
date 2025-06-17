import { Router } from 'express';
import TintaController from '../controllers/tintaController';

const router = Router();
const tintaController = new TintaController();

router
    .get('/', tintaController.getAllTintas)
    .get('/:id', tintaController.getTintaById)
    .post('/', tintaController.createTinta)

export default router;