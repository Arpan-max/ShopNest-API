const db = require('../config/db');

const createOrder = async (userId, shippingAddress, cartItems, totalAmount) => {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');

    // Lock cart items for this user along with their products to ensure stock is checked correctly
    const lockedCartItemsResult = await client.query(`
      SELECT ci.id, ci.product_id, ci.quantity, p.stock_quantity, p.price
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = $1
      FOR UPDATE OF p
    `, [userId]);

    const lockedCartItems = lockedCartItemsResult.rows;

    if (lockedCartItems.length === 0) {
      throw new Error('CART_EMPTY');
    }

    // Verify stock and compute total safely on the server side
    let calculatedTotal = 0;
    for (const item of lockedCartItems) {
      if (item.quantity > item.stock_quantity) {
        throw new Error(`OUT_OF_STOCK_${item.product_id}`);
      }
      calculatedTotal += parseFloat(item.price) * item.quantity;
    }

    // Insert into orders
    const orderResult = await client.query(`
      INSERT INTO orders (user_id, total_amount, shipping_address)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [userId, calculatedTotal, shippingAddress]);

    const order = orderResult.rows[0];

    // Insert order items and decrement stock
    for (const item of lockedCartItems) {
      await client.query(`
        INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
        VALUES ($1, $2, $3, $4)
      `, [order.id, item.product_id, item.quantity, item.price]);

      await client.query(`
        UPDATE products 
        SET stock_quantity = stock_quantity - $1 
        WHERE id = $2
      `, [item.quantity, item.product_id]);
    }

    // Clear cart
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

    await client.query('COMMIT');
    return order;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const findByUserId = async (userId) => {
  const result = await db.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return result.rows;
};

const findById = async (id) => {
  const result = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
  const order = result.rows[0];
  if (!order) return null;

  const itemsResult = await db.query(`
    SELECT oi.*, p.name as product_name, p.image_url as product_image
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = $1
  `, [id]);

  order.items = itemsResult.rows;
  return order;
};

const updateStatus = async (id, status) => {
  const result = await db.query(
    'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [status, id]
  );
  return result.rows[0];
};

module.exports = {
  createOrder,
  findByUserId,
  findById,
  updateStatus
};
