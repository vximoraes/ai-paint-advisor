import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swaggerConfig';
import routes from './routes/tintaRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// Swagger setup.
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(routes);
app.use(usuarioRoutes);
app.use(authRoutes);

export default app;