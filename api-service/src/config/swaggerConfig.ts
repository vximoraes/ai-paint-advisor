import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Loomi Paint Advisor API',
            version: '1.0.0',
            description: 'API para gerenciamento de tintas, usuários e autenticação, parte do Desafio Back-end IA da Loomi.',
        },
        servers: [
            {
                url: 'http://localhost:4000', 
                description: 'Servidor de Desenvolvimento',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Tinta: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        nome: { type: 'string' },
                        cor: { type: 'string' },
                        tipoSuperficie: { type: 'string' },
                        ambiente: { type: 'string', enum: ['INTERNO', 'EXTERNO'] },
                        tipoAcabamento: { type: 'string' },
                        features: { type: 'array', items: { type: 'string' } },
                        linha: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                TintaInput: {
                    type: 'object',
                    properties: {
                        nome: { type: 'string', example: 'Suvinil Toque Leve' },
                        cor: { type: 'string', example: 'Branco Neve' },
                        tipo_parede: { type: 'string', example: 'Alvenaria' },
                        ambiente: { type: 'string', enum: ['INTERNO', 'EXTERNO'], example: 'INTERNO' },
                        acabamento: { type: 'string', example: 'Fosco' },
                        features: { type: 'string', example: 'Lavável, Baixo Odor' },
                        linha: { type: 'string', example: 'Premium' },
                    },
                    required: ['nome', 'cor', 'tipo_parede', 'ambiente', 'acabamento', 'features', 'linha'],
                },
                Usuario: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        nome: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        role: { type: 'string', enum: ['USER', 'ADMIN'] },
                    },
                },
                UsuarioInput: {
                    type: 'object',
                    properties: {
                        nome: { type: 'string', example: 'User' },
                        email: { type: 'string', format: 'email', example: 'user@example.com' },
                        senha: { type: 'string', example: 'Senha123!' }
                    },
                    required: ['nome', 'email', 'senha'],
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts', './dist/routes/*.js'], 
};

export const swaggerSpec = swaggerJsdoc(options);