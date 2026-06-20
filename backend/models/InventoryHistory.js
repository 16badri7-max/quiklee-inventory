const pool = require('../config/db');

class InventoryHistory {
  static async log(productId, oldStock, newStock) {
    const sql = `
      INSERT INTO inventory_history (product_id, old_stock, new_stock, updated_at)
      VALUES (?, ?, ?, NOW())
    `;
    await pool.execute(sql, [productId, oldStock, newStock]);
  }

  static async recentByProduct(productId, limit = 10) {
    const [rows] = await pool.execute(`
      SELECT * FROM inventory_history
      WHERE product_id = ?
      ORDER BY updated_at DESC
      LIMIT ?
    `, [productId, limit]);
    return rows;
  }
}

module.exports = InventoryHistory;
