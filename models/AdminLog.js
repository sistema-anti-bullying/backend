import pool from '../config/database.js';

export class AdminLog {
  static async create(data) {
    const { admin_id, action, details, school_id } = data;

    const query = `
      INSERT INTO admin_logs (admin_id, action, details, school_id, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    `;

    const result = await pool.query(query, [admin_id, action, details, school_id]);
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM admin_logs WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.admin_id) {
      query += ` AND admin_id = $${paramCount}`;
      values.push(filters.admin_id);
      paramCount++;
    }

    if (filters.school_id) {
      query += ` AND school_id = $${paramCount}`;
      values.push(filters.school_id);
      paramCount++;
    }

    if (filters.action) {
      query += ` AND action = $${paramCount}`;
      values.push(filters.action);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async delete(id) {
    const query = 'DELETE FROM admin_logs WHERE id = $1';
    await pool.query(query, [id]);
  }
}
