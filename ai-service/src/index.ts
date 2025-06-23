import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import chatRoutes from './routes/chatRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());
app.use(chatRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('AI Service is running!');
});

app.listen(PORT, () => {
    console.log(`AI Service escutando na porta ${PORT}`);
});