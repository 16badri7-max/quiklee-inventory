const pool = require('../config/db');

class SupplierOrder {
  static async create(data) {
    const sql = 'INSERT INTO supplier_orders (supplier_id, product_id, quantity, status) VALUES ($1, $2, $3, $4) RETURNING id';
    const result = await pool.query(sql, [data.supplier_id, data.product_id, data.quantity, data.status || 'pending']);
    return result.rows[0].id;
  }

  static async findAll() {
    const sql = `
      SELECT so.*, s.name as supplier_name, p.product_name 
      FROM supplier_orders so 
      JOIN suppliers s ON so.supplier_id = s.id 
      JOIN products p ON so.product_id = p.id
      ORDER BY so.order_date DESC
    `;
    const result = await pool.query(sql);
    return result.rows;
  }
}

module.exports = SupplierOrder;