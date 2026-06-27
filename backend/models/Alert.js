const pool = require('../config/db');

class Alert {
  /**
   * Updates the general stock/status alert for a product.
   * Clears any existing general alert and inserts the new one.
   */
  static async updateAlertState(productId, type, message) {
    // Clear old general alerts
    await pool.query(
      `DELETE FROM alerts WHERE product_id = $1 AND alert_type IN ('Out of Stock', 'Low Stock', 'Achieved', 'Inactive', 'Archived')`,
      [productId]
    );
    // Insert new alert if specified
    if (type) {
      const sql = `
        INSERT INTO alerts (product_id, alert_type, message, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING id
      `;
      const result = await pool.query(sql, [productId, type, message]);
      return result.rows[0]?.id;
    }
    return null;
  }

  /**
   * Updates the expiry alert for a product.
   * Clears old expiry alerts and inserts the new one if specified.
   */
  static async updateExpiryAlertState(productId, type, message) {
    // Clear old expiry alerts
    await pool.query(
      `DELETE FROM alerts WHERE product_id = $1 AND alert_type IN ('Expired', 'Expiring Soon')`,
      [productId]
    );
    // Insert new alert if specified
    if (type) {
      const sql = `
        INSERT INTO alerts (product_id, alert_type, message, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING id
      `;
      const result = await pool.query(sql, [productId, type, message]);
      return result.rows[0]?.id;
    }
    return null;
  }

  static async findAll() {
    const result = await pool.query(`
      SELECT a.*, p.product_name, p.sku
      FROM alerts a
      JOIN products p ON a.product_id = p.id
      ORDER BY a.created_at DESC
    `);
    return result.rows;
  }
}

module.exports = Alert;
