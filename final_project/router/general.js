const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;

  if (!username || !password) return res.status(422).json({message: "Username AND password are required"});

  const userExists = users.findIndex(user => user.username === username) > -1;

  if (userExists) return res.status(422).json({message: "An user with the same name exists"});

  users.push({
    username, password
  });

  return res.json(users.find(u => u.username === username));
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.json(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const {isbn} = req.params;

  const book = books[isbn]; // assuming isbn is the key

  return res.json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const {author} = req.params;

  const authorBooks = [];
  for (const isbn in books) {
    if (author === books[isbn].author) authorBooks.push(books[isbn])
  }

  return res.json(authorBooks)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const {title} = req.params;

  const titleBooks = [];
  for (const isbn in books) {
    if (title === books[isbn].title) {
      titleBooks.push(books[isbn])
    }
  }

  return res.json(titleBooks)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const {isbn} = req.params;

  const book = books[isbn]; // assuming isbn is the key

  return res.json(book.reviews);
});

module.exports.general = public_users;
