import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import cultivosRoutes from './routes/cultivos.js';

// Cargar variables de entorno
dotenv.config();

const app = express();

const corsOptions = {
    origin: 'http://gabrilreyes.zapto.org/', // Aquí coloca el dominio de tu frontend
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: ['Content-Type'],
  };
  
  app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/auth', authRoutes);
app.use('/cultivos', cultivosRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
