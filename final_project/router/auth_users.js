const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let usersWithSameName = users.filter(
    (user) => user.username == username,
  );

  if (usersWithSameName.length > 0) return true;
  else return false;
};

const authenticatedUser = (username, password) => {
  let validUsers = users.filter(
    (user) => user.username == username && user.password == password,
  );
  if (validUsers.length > 0) return true;
  else return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password)
    res.status(404).json({ message: "Error logging in" });

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 },
    );
    req.session.authorization = {
      accessToken,
      username,
    };
    return res
      .status(200)
      .json({ message: "User logged in successfully" });
  } else {
    return res
      .status(208)
      .json({ message: "Invalid login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    let review = req.query.review;
    let reviewer = req.session.authorization["username"];
    if (review) {
      book["reviews"][reviewer] = review;
      books[isbn] = book;
    }
    res
      .status(200)
      .send(
        `The review for the book with ISBN ${isbn} has been updated`,
      );
  } else {
    res.status(404).json({ message: "Invalid input" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];
  let reviewer = req.session.authorization["username"];
  if (book) {
    delete book["reviews"][reviewer];
    return res
      .status(200)
      .send(`The review for the book ${isbn} has been deleted`);
  } else {
    res.status(404).json({ message: "Invalid Input" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
