const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;

  if (!username || !password) return res.status(401).json({message: "Username AND password are required"});

  const user = users.find(user => user.username === username);

  if (!user || user.password !== password) return res.status(401).json({message: "Invalid credentials"});

  const token = jwt.sign({user: user.username}, 'pkey1234');

  return res.json({
      token
  })

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const {isbn} = req.params;
  const {review} = req.body;

  console.log(req.authPayload)

  const book = books[isbn];

  book.reviews = {
    ...book.reviews,
    [req.authPayload.user]: review
  }
  return res.json(book);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
