const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        // We define a function that returns our books
        const getBooks = () => {
            return new Promise((resolve) => {
                resolve(books);
            });
        };

        // We "await" the result as if it were an external Axios call
        const bookList = await getBooks();
        res.status(200).send(JSON.stringify(bookList, null, 4));

    } catch (error) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        // We create a promise to handle the book search asynchronously
        const getBook = new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject("Book not found");
            }
        });

        // Awaiting the promise result
        const bookDetails = await getBook;
        res.status(200).json(bookDetails);

    } catch (error) {
        res.status(404).json({ message: error });
    }
});

// Get book details based on author
// Task 12: Get book details based on author using async-await with Axios
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
  
    try {
      const getBooksByAuthor = new Promise((resolve, reject) => {
        const bookKeys = Object.keys(books);
        const filteredBooks = bookKeys
          .filter(key => books[key].author === author)
          .map(key => books[key]);
  
        if (filteredBooks.length > 0) {
          resolve(filteredBooks);
        } else {
          reject("No books found for this author");
        }
      });
  
      const result = await getBooksByAuthor;
      res.status(200).json(result);
  
    } catch (error) {
      res.status(404).json({ message: error });
    }
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    const title = req.params.title;
    const bookKeys = Object.keys(books); // Get all IDs (1, 2, 3...)
    const filteredBooks = [];

    bookKeys.forEach(key => {
        if (books[key].title === title) {
            filteredBooks.push(books[key]);
        }
    });

    res.send(JSON.stringify(filteredBooks, null, 4));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
