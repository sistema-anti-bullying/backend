import express from 'express';
import { generateToken } from '../middlewares/auth.js';
import { User } from '../models/User.js';

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, school_id } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'user',
      school_id
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro ao registrar:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const user = await User.verifyPassword(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

export default router;
