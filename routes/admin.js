import express from 'express';
import { AdminLog } from '../models/AdminLog.js';
import { InternalNote } from '../models/InternalNote.js';
import { Report } from '../models/Report.js';
import { User } from '../models/User.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Middleware para verificar se é admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

// Dashboard - Estatísticas
router.get('/dashboard', authenticateToken, isAdmin, async (req, res) => {
  try {
    const reports = await Report.findAll({ school_id: req.user.school_id });
    const users = await User.findAll({ school_id: req.user.school_id });
    const logs = await AdminLog.findAll({ school_id: req.user.school_id });

    const stats = {
      totalReports: reports.length,
      openReports: reports.filter(r => r.status === 'open').length,
      closedReports: reports.filter(r => r.status === 'closed').length,
      totalUsers: users.length,
      adminUsers: users.filter(u => u.role === 'admin').length,
      recentLogs: logs.slice(0, 10)
    };

    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
    res.status(500).json({ error: 'Erro ao buscar dashboard' });
  }
});

// Adicionar nota interna em denúncia
router.post('/reports/:report_id/notes', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { report_id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Conteúdo da nota é obrigatório' });
    }

    const note = await InternalNote.create({
      report_id,
      author_id: req.user.id,
      content
    });

    // Log da ação
    await AdminLog.create({
      admin_id: req.user.id,
      action: 'add_internal_note',
      details: `Adicionada nota interna à denúncia ${report_id}`,
      school_id: req.user.school_id
    });

    res.status(201).json({
      message: 'Nota adicionada com sucesso',
      note
    });
  } catch (error) {
    console.error('Erro ao adicionar nota:', error);
    res.status(500).json({ error: 'Erro ao adicionar nota' });
  }
});

// Buscar notas internas de uma denúncia
router.get('/reports/:report_id/notes', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { report_id } = req.params;

    const notes = await InternalNote.findByReportId(report_id);

    res.json(notes);
  } catch (error) {
    console.error('Erro ao buscar notas:', error);
    res.status(500).json({ error: 'Erro ao buscar notas' });
  }
});

// Listar logs administrativos
router.get('/logs', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { admin_id, action } = req.query;

    const logs = await AdminLog.findAll({
      admin_id,
      action,
      school_id: req.user.school_id
    });

    res.json(logs);
  } catch (error) {
    console.error('Erro ao listar logs:', error);
    res.status(500).json({ error: 'Erro ao listar logs' });
  }
});

// Criar usuário admin (apenas admin pode criar outro admin)
router.post('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password, role = 'admin' } = req.body;

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
      role,
      school_id: req.user.school_id
    });

    // Log da ação
    await AdminLog.create({
      admin_id: req.user.id,
      action: 'create_user',
      details: `Usuário ${name} (${email}) criado com role ${role}`,
      school_id: req.user.school_id
    });

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

export default router;
