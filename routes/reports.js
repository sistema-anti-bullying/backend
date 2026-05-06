import express from 'express';
import { Report } from '../models/Report.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Criar denúncia
router.post('/', async (req, res) => {
  try {
    const {
      protocol,
      victim_name,
      is_anonymous,
      aggressor_name,
      class_grade,
      description,
      bullying_type,
      school_id
    } = req.body;

    if (!victim_name || !description) {
      return res.status(400).json({ error: 'Nome da vítima e descrição são obrigatórios' });
    }

    const report = await Report.create({
      protocol,
      victim_name,
      is_anonymous,
      aggressor_name,
      class_grade,
      description,
      bullying_type,
      school_id
    });

    res.status(201).json({
      message: 'Denúncia criada com sucesso',
      report
    });
  } catch (error) {
    console.error('Erro ao criar denúncia:', error);
    res.status(500).json({ error: 'Erro ao criar denúncia' });
  }
});

// Buscar denúncia por protocolo
router.get('/:protocol', async (req, res) => {
  try {
    const { protocol } = req.params;

    const report = await Report.findByProtocol(protocol);
    if (!report) {
      return res.status(404).json({ error: 'Denúncia não encontrada' });
    }

    res.json(report);
  } catch (error) {
    console.error('Erro ao buscar denúncia:', error);
    res.status(500).json({ error: 'Erro ao buscar denúncia' });
  }
});

// Listar todas as denúncias (requer autenticação)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, school_id } = req.query;

    const reports = await Report.findAll({
      status,
      school_id: school_id || req.user.school_id
    });

    res.json(reports);
  } catch (error) {
    console.error('Erro ao listar denúncias:', error);
    res.status(500).json({ error: 'Erro ao listar denúncias' });
  }
});

// Atualizar denúncia (requer autenticação)
router.patch('/:protocol', authenticateToken, async (req, res) => {
  try {
    const { protocol } = req.params;
    const updateData = req.body;

    const report = await Report.update(protocol, updateData);
    if (!report) {
      return res.status(404).json({ error: 'Denúncia não encontrada' });
    }

    res.json({
      message: 'Denúncia atualizada com sucesso',
      report
    });
  } catch (error) {
    console.error('Erro ao atualizar denúncia:', error);
    res.status(500).json({ error: 'Erro ao atualizar denúncia' });
  }
});

// Deletar denúncia (requer autenticação)
router.delete('/:protocol', authenticateToken, async (req, res) => {
  try {
    const { protocol } = req.params;

    await Report.delete(protocol);

    res.json({ message: 'Denúncia deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar denúncia:', error);
    res.status(500).json({ error: 'Erro ao deletar denúncia' });
  }
});

export default router;
