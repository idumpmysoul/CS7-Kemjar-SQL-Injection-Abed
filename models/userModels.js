const sql = require("../db");
const { pool } = require('../db');

exports.findAll = async () => {
  return await sql`SELECT id, name, username, email FROM users`;
};

exports.findById = async (id) => {
  const result = await sql`SELECT id, name, username, email FROM users WHERE id = ${id}`;
  return result[0];
};

exports.create = async ({ name, username, email, password }) => {
  const result = await sql`
    INSERT INTO users (name, username, email, password)
    VALUES (${name}, ${username}, ${email}, ${password})
    RETURNING id, name, username, email;
  `;
  return result[0];
};

exports.update = async (id, { name, username, email, password }) => {
  const result = await sql`
    UPDATE users
    SET name = ${name}, username = ${username}, email = ${email}, password = ${password}
    WHERE id = ${id}
    RETURNING id, name, username, email;
  `;
  return result[0];
};

exports.remove = async (id) => {
  await sql`DELETE FROM users WHERE id = ${id}`;
};

exports.findByCredentials = async (username, password) => {
  const result = await sql`
    SELECT id, name, username, email FROM users
    WHERE username = ${username} AND password = ${password}
  `;
  return result[0];
};

exports.findPasswordByCredentials = async (username, password) => {
  // Gunakan `sql` tag untuk parameterisasi otomatis
  const result = await sql`
    SELECT username, password FROM users
    WHERE username = ${username} AND password = ${password}
  `;
  return result;
};