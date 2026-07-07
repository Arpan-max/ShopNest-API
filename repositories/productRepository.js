const db = require('../config/db');

const findAndCountAll = async ({ category, minPrice, maxPrice, search, sortBy, limit, offset }) => {
  let query = `
    SELECT p.id, p.name, p.description, p.price, p.stock_quantity, 
           p.image_url, p.created_at, p.updated_at, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `;
  
  const values = [];
  let paramIndex = 1;

  if (category) {
    query += ` AND c.slug = $${paramIndex++}`;
    values.push(category);
  }

  if (minPrice) {
    query += ` AND p.price >= $${paramIndex++}`;
    values.push(minPrice);
  }

  if (maxPrice) {
    query += ` AND p.price <= $${paramIndex++}`;
    values.push(maxPrice);
  }

  if (search) {
    query += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
    values.push(`%${search}%`);
    paramIndex++;
  }

  const countQuery = `SELECT COUNT(*) as total FROM (${query}) AS subquery`;
  const totalResult = await db.query(countQuery, values);
  const total = parseInt(totalResult.rows[0].total, 10);

  if (sortBy === 'price_asc') {
    query += ' ORDER BY p.price ASC';
  } else if (sortBy === 'price_desc') {
    query += ' ORDER BY p.price DESC';
  } else if (sortBy === 'newest') {
    query += ' ORDER BY p.created_at DESC';
  } else if (sortBy === 'name_asc') {
    query += ' ORDER BY p.name ASC';
  } else {
    query += ' ORDER BY p.created_at DESC';
  }

  query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
  values.push(limit, offset);

  const result = await db.query(query, values);
  return { rows: result.rows, total };
};

const findById = async (id) => {
  const result = await db.query(`
    SELECT p.id, p.name, p.description, p.price, p.stock_quantity, 
           p.category_id, p.image_url, p.created_at, p.updated_at, 
           c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = $1
  `, [id]);
  return result.rows[0];
};

const create = async (name, description, price, stockQuantity, categoryId, imageUrl) => {
  const result = await db.query(`
    INSERT INTO products (name, description, price, stock_quantity, category_id, image_url)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `, [name, description, price, stockQuantity, categoryId, imageUrl]);
  return result.rows[0];
};

const update = async (id, fields) => {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  
  if (keys.length === 0) return null;

  const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
  const query = `
    UPDATE products 
    SET ${setClause}, updated_at = NOW() 
    WHERE id = $${keys.length + 1} 
    RETURNING *
  `;
  
  values.push(id);
  const result = await db.query(query, values);
  return result.rows[0];
};

const remove = async (id) => {
  const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
};

module.exports = {
  findAndCountAll,
  findById,
  create,
  update,
  remove
};
