const db = require('../config/db');

const findAll = async () => {
  const result = await db.query('SELECT id, name, slug FROM categories ORDER BY name ASC');
  return result.rows;
};

const findById = async (id) => {
  const result = await db.query('SELECT id, name, slug FROM categories WHERE id = $1', [id]);
  return result.rows[0];
};

const create = async (name, slug) => {
  const result = await db.query(
    'INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING id, name, slug',
    [name, slug]
  );
  return result.rows[0];
};

const update = async (id, name, slug) => {
  const result = await db.query(
    'UPDATE categories SET name = $1, slug = $2 WHERE id = $3 RETURNING id, name, slug',
    [name, slug, id]
  );
  return result.rows[0];
};

const remove = async (id) => {
  const result = await db.query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
