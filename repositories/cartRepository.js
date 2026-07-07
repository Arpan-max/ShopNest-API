const db = require('../config/db');

const findByUserId = async (userId) => {
  const result = await db.query(`
    SELECT ci.id, ci.user_id, ci.product_id, ci.quantity, ci.created_at,
           p.name as product_name, p.price as product_price, p.image_url as product_image
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = $1
  `, [userId]);
  return result.rows;
};

const findItem = async (userId, productId) => {
  const result = await db.query(
    'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
    [userId, productId]
  );
  return result.rows[0];
};

const findItemById = async (id, userId) => {
  const result = await db.query(
    'SELECT * FROM cart_items WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return result.rows[0];
};

const createOrUpdate = async (userId, productId, quantity) => {
  const result = await db.query(`
    INSERT INTO cart_items (user_id, product_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, product_id)
    DO UPDATE SET quantity = cart_items.quantity + $3
    RETURNING *
  `, [userId, productId, quantity]);
  return result.rows[0];
};

const updateQuantity = async (id, quantity) => {
  const result = await db.query(`
    UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *
  `, [quantity, id]);
  return result.rows[0];
};

const remove = async (id, userId) => {
  const result = await db.query(
    'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );
  return result.rows[0];
};

const clearCart = async (userId) => {
  const result = await db.query(
    'DELETE FROM cart_items WHERE user_id = $1 RETURNING id',
    [userId]
  );
  return result.rows;
};

module.exports = {
  findByUserId,
  findItem,
  findItemById,
  createOrUpdate,
  updateQuantity,
  remove,
  clearCart
};
