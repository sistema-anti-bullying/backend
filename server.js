import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar rotas
import reportsRoutes from './routes/reports.js';
import usersRoutes from './routes/users.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rotas de denúncias
app.use('/api/reports', reportsRoutes);

// Rotas de usuários
app.use('/api/users', usersRoutes);

// Rotas administrativas
app.use('/api/admin', adminRoutes);

// Rota de saúde
app.get('/health', (req, res) => {
  res.json({ status: 'Backend rodando com sucesso!' });
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});
