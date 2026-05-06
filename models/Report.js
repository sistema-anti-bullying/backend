import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export class Report {
  static async create(data) {
    const {
      protocol,
      victim_name,
      is_anonymous,
      aggressor_name,
      class_grade,
      description,
      bullying_type,
      school_id
    } = data;

    const query = `
      INSERT INTO reports (
        protocol, victim_name, is_anonymous, aggressor_name, 
        class_grade, description, bullying_type, school_id, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'open', NOW())
      RETURNING *
    `;

    const result = await pool.query(query, [
      protocol || uuidv4(),
      victim_name,
      is_anonymous,
      aggressor_name,
      class_grade,
      description,
      bullying_type,
      school_id
    ]);

    return result.rows[0];
  }

  static async findByProtocol(protocol) {
    const query = 'SELECT * FROM reports WHERE protocol = $1';
    const result = await pool.query(query, [protocol]);
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM reports WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.status) {
      query += ` AND status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters.school_id) {
      query += ` AND school_id = $${paramCount}`;
      values.push(filters.school_id);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async update(protocol, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(data).forEach(key => {
      if (key !== 'protocol') {
        fields.push(`${key} = $${paramCount}`);
        values.push(data[key]);
        paramCount++;
      }
    });

    values.push(protocol);

    const query = `
      UPDATE reports 
      SET ${fields.join(', ')} 
      WHERE protocol = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(protocol) {
    const query = 'DELETE FROM reports WHERE protocol = $1';
    await pool.query(query, [protocol]);
  }
}
