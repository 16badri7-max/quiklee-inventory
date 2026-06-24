const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'quiklee_inventory',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Initialize MySQL tables and seed if empty
(async () => {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_name VARCHAR(255) NOT NULL,
        sku VARCHAR(100) NOT NULL UNIQUE,
        category VARCHAR(100) NOT NULL,
        store_name VARCHAR(100) NOT NULL,
        stock_level INT NOT NULL DEFAULT 0,
        picked_quantity INT NOT NULL DEFAULT 0,
        reorder_level INT NOT NULL DEFAULT 0,
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        expiry_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS alerts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        alert_type VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS inventory_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        old_stock INT NOT NULL,
        new_stock INT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'staff',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        contact_info TEXT,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS supplier_orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        supplier_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS sales (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    // Seed 'badri' if not exists
    const [userRows] = await pool.execute("SELECT COUNT(*) as count FROM users WHERE username = 'badri'");
    if (userRows && userRows[0] && userRows[0].count === 0) {
      await pool.execute(`
        INSERT INTO users (username, password, role)
        VALUES ('badri', '1234567', 'admin')
      `);
      console.log("MySQL seeded: user 'badri' created.");
    }

    // Check default staff
    const [staffRows] = await pool.execute("SELECT COUNT(*) as count FROM users WHERE username = 'staff'");
    if (staffRows && staffRows[0] && staffRows[0].count === 0) {
      await pool.execute(`
        INSERT INTO users (username, password, role)
        VALUES ('staff', 'staff', 'staff')
      `);
    }

    const [supplierRows] = await pool.execute('SELECT COUNT(*) as count FROM suppliers');
    if (supplierRows && supplierRows[0] && supplierRows[0].count === 0) {
      await pool.execute(`
        INSERT INTO suppliers (name, contact_info, email)
        VALUES 
        ('Global Foods Inc.', 'John Doe - 555-0101', 'contact@globalfoods.com'),
        ('Local Farm Organics', 'Jane Smith - 555-0202', 'hello@localfarm.com')
      `);
    }

    const [productRows] = await pool.execute('SELECT COUNT(*) as count FROM products');
    if (productRows && productRows[0] && productRows[0].count === 0) {
      await pool.execute(`
        INSERT INTO products (product_name, sku, category, store_name, stock_level, picked_quantity, reorder_level, status, expiry_date)
        VALUES 
        ('Organic Rice', 'QR-001', 'Grains', 'Store A', 120, 30, 50, 'active', '2026-12-31'),
        ('Almond Milk', 'QR-002', 'Beverages', 'Store B', 45, 10, 20, 'active', '2026-07-15'),
        ('Chocolate Chip Cookies', 'QR-003', 'Snacks', 'Store A', 0, 0, 15, 'active', '2026-08-01')
      `);

      await pool.execute(`
        INSERT INTO sales (product_id, quantity, total_price, sale_date)
        VALUES 
        (1, 5, 25.00, NOW() - INTERVAL 5 DAY),
        (1, 10, 50.00, NOW() - INTERVAL 3 DAY),
        (1, 15, 75.00, NOW() - INTERVAL 1 DAY),
        (2, 2, 8.00, NOW() - INTERVAL 4 DAY),
        (2, 8, 32.00, NOW() - INTERVAL 2 DAY)
      `);
      console.log("MySQL database seeded with products, suppliers, and sales.");
    }
  } catch (err) {
    console.error("Error auto-initializing MySQL database tables:", err);
  }
})();

module.exports = pool;