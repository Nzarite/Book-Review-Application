const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBooks = () => {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
};

public_users.post("/register", (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({
        username: username,
        password: password,
      });
      return res
        .status(200)
        .json({ message: "User registered successfully" });
    } else {
      return res.status(404).json({ message: "User already exists" });
    }
  } else {
    return res.status(404).json({ message: "Unable to register user" });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});
// Task 10
public_users.get("/books", async function (req, res) {
  try {
    res.json(await getBooks());
  } catch (error) {
    res.status(500).json({ message: "Error fetching book list" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});
// Task 11
public_users.get("/books/isbn/:isbn", async function (req, res) {
  try {
    const isbn = req.params.isbn;
    if (!isbn) return res.json({ message: "Invalid input" });

    const allBooks = await getBooks();
    res.send(allBooks[isbn]);
  } catch (error) {
    res.status(403).json({ message: error });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  if (author) {
    let book = Object.values(books).filter(
      (book) => book.author == author,
    );
    if (book.length > 0) res.send(JSON.stringify(book, null, 4));
  }
});
// Task 12
public_users.get("/books/author/:author", async function (req, res) {
  try {
    const author = req.params.author;
    if (author) {
      let book = Object.values(await getBooks()).filter(
        (book) => book.author == author,
      );
      if (book.length > 0) res.send(JSON.stringify(book, null, 4));
    } else {
      res.json({ message: "Invalid input" });
    }
  } catch (error) {
    res.json({ message: error });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  if (title) {
    let book = Object.values(books).filter(
      (book) => book.title == title,
    );
    if (book.length > 0) res.send(JSON.stringify(book, null, 4));
  }
});
// Task 13
public_users.get("/books/title/:title", async function (req, res) {
  try {
    const title = req.params.title;
    if (title) {
      let book = Object.values(await getBooks()).filter(
        (book) => book.title == title,
      );
      if (book.length > 0) res.send(JSON.stringify(book, null, 4));
    } else {
      res.json({ message: "Invalid input" });
    }
  } catch (error) {
    res.json({ message: error });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
