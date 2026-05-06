import pool from '../config/database.js';

export class InternalNote {
  static async create(data) {
    const { report_id, author_id, content } = data;

    const query = `
      INSERT INTO internal_notes (report_id, author_id, content, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *
    `;

    const result = await pool.query(query, [report_id, author_id, content]);
    return result.rows[0];
  }

  static async findByReportId(report_id) {
    const query = `
      SELECT in.*, u.name as author_name 
      FROM internal_notes in
      JOIN users u ON in.author_id = u.id
      WHERE in.report_id = $1
      ORDER BY in.created_at DESC
    `;

    const result = await pool.query(query, [report_id]);
    return result.rows;
  }

  static async update(id, content) {
    const query = `
      UPDATE internal_notes 
      SET content = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [content, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM internal_notes WHERE id = $1';
    await pool.query(query, [id]);
  }
}
