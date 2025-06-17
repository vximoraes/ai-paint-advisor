import { Router } from 'express';
import { getAllTintas, getTintaById, createTinta } from '../controllers/tintaController';

const router = Router();

router.get('/', getAllTintas);
router.get('/:id', getTintaById);
router.post('/', createTinta);

export default router;