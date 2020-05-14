const { Client } = require('pg');

const client = new Client('postgres://localhost:5432/juicebox-dev');

// -------------------- USERS --------------------
async function getAllUsers() {
  const { rows } = await client.query(`
    SELECT id, username, name, location, active
    FROM users;
  `);
  return rows;
}

async function createUser({ username, password, name, location }) {
  try {
    const {rows} = await client.query(`
      INSERT INTO users(username, password, name, location) VALUES ($1, $2, $3, $4)
      ON CONFLICT (username) DO NOTHING 
      RETURNING *
    `, [username, password, name, location]);

    return rows
  } catch (error) {
    throw error;
  }
}

async function updateUser(id, fields = {}) {
  // build the set string
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {rows} = await client.query(`
      UPDATE users
      SET ${ setString }
      WHERE id=${ id }
      RETURNING *;
    `, Object.values(fields));

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  // first get the user
  try {
    const {rows} = await client.query(`
      SELECT *
      FROM users
      WHERE id = $1;
    `, [userId]);
    
    // if it doesn't exist, return null
    if (!rows || !rows.length) return null;
    
    // if it does:
    // delete the 'password' key from the returned object
    const [user] = rows;
    
    delete user.password;
    
    // get their posts (use getPostsByUser)
    const posts = await  getPostsByUser(userId);
    // then add the posts to the user object with key 'posts'
    
    user.posts = posts;
    // return the user object
    return user;
    
  } catch (error) {
    console.error(error)
  }

}


// -------------------- POSTS --------------------

async function createPost({
  authorId,
  title,
  content
}) {
  try {
    const {rows} = await client.query(`
      INSERT INTO posts("authorId", title, content) VALUES ($1, $2, $3)
      RETURNING *
    `, [authorId, title, content]);

    return rows
  } catch (error) {
    throw error;
  }
}

async function updatePost(id, fields = {}) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {rows} = await client.query(`
      UPDATE posts
      SET ${ setString }
      WHERE id=${ id }
      RETURNING *;
    `, Object.values(fields));

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllPosts() {
  try {
    const { rows } = await client.query(`
      SELECT *
      FROM posts;
    `);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getPostsByUser(userId) {
  try {
    const {rows} = await client.query(`
      SELECT * FROM posts
      WHERE "authorId"=${ userId };
    `);
    return rows;
  } catch (error) {
    throw error;
  }
}
module.exports = {
  client,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  createPost,
  updatePost,
  getAllPosts,
  getPostsByUser,
}

