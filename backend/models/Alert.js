const pool = require('../config/db');

class Alert {
  static async create(productId, type, message) {
    const sql = `
      INSERT INTO alerts (product_id, alert_type, message, created_at)
      VALUES (?, ?, ?, NOW())
    `;
    const [result] = await pool.execute(sql, [productId, type, message]);
    return result.insertId;
  }

  static async findAll() {
    // Join products table to retrieve the product details
    const [rows] = await pool.execute(`
      SELECT a.*, p.product_name, p.sku
      FROM alerts a
      JOIN products p ON a.product_id = p.id
      ORDER BY a.created_at DESC
    `);
    return rows;
  }
}

module.exports = Alert;
