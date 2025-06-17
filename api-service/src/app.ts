import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import routes from './routes/tintaRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// Swagger setup.
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Loomi Paint Advisor API',
            version: '1.0.0',
            description: 'API documentation for Loomi Paint Advisor',
        },
    },
    apis: ['./src/interfaces/http/routes/*.ts', './src/interfaces/http/controllers/*.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(routes);

export default app;