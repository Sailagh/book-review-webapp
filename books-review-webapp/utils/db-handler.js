const { readSync } = require("fs");
const db = require("../data/database");

const getBook = async () => {
  const query = `
    SELECT books.*, types.name AS genre_name
    FROM books
    INNER JOIN types ON books.type_id = types.type_id
  `;
  const [records] = await db.query("SELECT * FROM books");
  const [values] = await db.query(query);
  return records;
};

const getReview = async () => {
  const [records] = await db.query(
    `SELECT reviews.*, reviews.description AS revi_description
    FROM reviews
    INNER JOIN books ON books.id_b = reviews.id_b
    INNER JOIN users ON users.user_id = reviews.user_id
    `
  );
  return records;
};
const getTypes = async () => {
  const [records] = await db.query("SELECT * FROM types");
  return records;
};

const newBook = async (values) => {
  const query = `
      INSERT INTO books (title,author_name, description,ISBN, type_id)
      VALUES (?)
      `;
  await db.query(query, [values]);
};

const newReview = async (values) => {
  const [book_title, description, rating, user_id] = values;

  const bookQuery = `
    SELECT id_b FROM books WHERE title = ?;
  `;
  const [bookRows] = await db.query(bookQuery, [book_title]);
  if (bookRows.length === 0) {
    const placeholderId = await createPlaceholderBook(book_title);
    await insertReview(book_title, description, rating, user_id, placeholderId);
  } else {
    const id_b = bookRows[0].id_b;
    await insertReview(book_title, description, rating, user_id, id_b);
  }
};

const addReviewtoBook = async (review) => {
  await db.query(
    `
    INSERT INTO reviews (user_id, description, rating, id_b) 
    VALUES (?);
    `,
    [review]
  );
};

const createPlaceholderBook = async (book_title) => {
  const query = `
      INSERT INTO books (title) VALUES (?);
    `;
  const [result] = await db.query(query, [book_title]);
  return result.insertId;
};

const insertReview = async (book_title, description, rating, userId, id_b) => {
  const reviewQuery = `
    INSERT INTO reviews (book_title, description, rating, user_id, id_b)
    VALUES (?, ?, ?, ?, ?);
  `;
  await db.query(reviewQuery, [book_title, description, rating, userId, id_b]);
};

const getReviewByUserId = async (id) => {
  const query = `
  SELECT *, reviews.description AS revi_description
  FROM reviews
  INNER JOIN users ON users.user_id = reviews.user_id
  WHERE reviews.user_id = ?
   `;
  const [records] = await db.query(query, [id]);
  return records;
};
const getReviewById = async (id) => {
  const query = `
      SELECT * FROM reviews INNER JOIN books
      ON  books.id_b = reviews.id_b
      WHERE id_a = ?
      `;
  const [records] = await db.query(query, [id]);

  return records;
};

const updateReviewById = async (id, values) => {
  const query = `
      UPDATE reviews set description = ?, rating = ?
      WHERE id_a = ?
      `;

  await db.query(query, [...values, id]);
};

const getBooksById = async (id) => {
  const query = `
      select books.*, types.name as type_id from books
      INNER JOIN types ON 
      types.type_id = books.type_id WHERE id_b = ?
      `;
  const [records] = await db.query(query, [id]);
  return records;
};
const getRevforBooks = async (id) => {
  const query = `SELECT * from reviews WHERE id_b = ? `;
  const [records] = await db.query(query, [id]);
  return records;
};

const createUser = async (values) => {
  const query = `
    INSERT INTO users (username, email, password, salt) VALUES (?)
    `;
  const [result] = await db.query(query, [values]);
  return result;
};
const getUserBy = async (col, value) => {
  const query = `SELECT * FROM users WHERE ${col} =?`;
  const [records] = await db.query(query, [value]);
  return records;
};
const deletereviewById = async (id) => {
  await db.query("DELETE FROM reviews WHERE id_a = ?", [id]);
};

const getAllUsers = async () => {
  const query = `SELECT * FROM users`;
  const [users] = await db.query(query);
  return users;
};
const getUserById = async (id) => {
  const [user] = await db.query("SELECT * FROM users WHERE user_id = ?", [id]);
  return user[0];
};
const updateUser = async (username, about, profile_picture, userID) => {
  try {
    const query = `
      UPDATE users
      SET       
          username = ?,
          about = ?,
          profile_picture = ?
      WHERE user_id = ?
    `;

    await db.query(query, [username, about, profile_picture, userID]);
  } catch (error) {
    throw error;
  }
};
const deleteUSer = async (id) => {
  await db.query("DELETE FROM users WHERE user_id = ?", [id]);
};

const initDB = async () => {
  let tables = [
    `CREATE TABLE IF NOT EXISTS types (
        type_id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        
        PRIMARY KEY (type_id)
    );
    CREATE TABLE IF NOT EXISTS users (
        user_id INT NOT NULL AUTO_INCREMENT,
        username VARCHAR(100) NOT NULL,
        profile_picture VARCHAR(255),
        about VARCHAR(650),
        email VARCHAR(255) NOT NULL,
        password varchar(255) NOT NULL,
        salt varchar(255) NOT NULL,
        PRIMARY KEY (user_id)
    );
    
    CREATE TABLE IF NOT EXISTS books (
        id_b INT NOT NULL AUTO_INCREMENT,
        title VARCHAR(250)  , NOT NULL
        author_name VARCHAR(255)  ,
        description VARCHAR(512)  ,
        ISBN VARCHAR(13)  ,
        type_id INT,
        
        FOREIGN KEY (type_id) REFERENCES types(type_id),
        PRIMARY KEY (id_b)
       
    );
    CREATE TABLE IF NOT EXISTS reviews (
        id_a INT NOT NULL AUTO_INCREMENT,
        book_title VARCHAR(255) NOT NULL,
        description VARCHAR(800) NOT NULL,
        rating INT,
        user_id INT NOT NULL,
        id_b INT NOT NULL,
    
        
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (id_b) REFERENCES books(id_b),
        PRIMARY KEY (id_a),
        INDEX idx_books_id_b (id_b)
        
    );`,
  ];
  await db.query("CREATE DATABASE IF NOT EXISTS portal");
  await db.query("use portal");
};

const updateUserAbout = async (userID, about) => {
  try {
    const query = `
      UPDATE users
      SET about = ?
      WHERE user_id = ?
    `;

    await db.query(query, [about, userID]);
  } catch (error) {
    throw error;
  }
};
const updateUserProfilePicture = async (userID, profilePicture) => {
  try {
    const query = `
      UPDATE users
      SET profile_picture = ?
      WHERE user_id = ?
    `;
    await db.query(query, [profilePicture, userID]);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getBook,
  getReview,
  getTypes,
  newBook,
  newReview,
  createPlaceholderBook,
  insertReview,
  getReviewById,
  addReviewtoBook,
  updateReviewById,
  getBooksById,
  getRevforBooks,
  createUser,
  getUserBy,
  deletereviewById,
  getReviewByUserId,
  updateUserAbout,
  updateUserProfilePicture,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUSer,
  initDB,
};
