import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;

app.get('/', (req: Request, res: Response) => {
    res.send('AI Service is running!');
});

app.listen(PORT, () => {
    console.log(`AI Service escutando na porta ${PORT}`);
});