const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// task 6
// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) { 
            users.push({"username": username, "password": password});
            return res.status(200).json({ message: "User successfully registered. Now you can log in." });
        } else {
            return res.status(409).json({ message: "User already exists!" });
        }
    } 
    return res.status(400).json({ message: "Unable to register user." });
});






// task 1
// get list of books available in the shop
public_users.get('/',function (req, res) {
  try {
    const bookList = books; 
    res.json(bookList); // format JSON output
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book list" });
  }
});

// task 2
// get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  try {
    const requestedIsbn = req.params.isbn; // retrieve ISBN from request parameters
    const book = books[requestedIsbn];
    if (book) {
      res.json(book); // sending book details as a JSON response
    } else {
      res.status(404).json({ message: "Book not found" }); // handle if the book is not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book details" }); // handle unexpected errors
  }
 });

// task 3
// get the book details based on author
public_users.get('/author/:author',function (req, res) {
  try {
    const requestedAuthor = req.params.author; // retrieve author from request parameters
    const matchingBooks = [];


    // get all book keys!
    const bookKeys = Object.keys(books);


    // Iterate through books and find matches
    for (const key of bookKeys) {
      const book = books[key];
      if (book.author === requestedAuthor) {
        matchingBooks.push(book);
      }
    }

    if (matchingBooks.length > 0) {
      res.json(matchingBooks); // send the matching books in JSON response
    } else {
      res.status(404).json({ message: "No books found by that author" }); // handle no books found
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving books" }); // handle unexpected errors
  }
});

//  task 4
// get all books based on the title
public_users.get('/title/:title',function (req, res) {
  try {
    const requestedTitle = req.params.title; // retrieve title from request parameters
    const matchingBooks = [];

    // get all book keys
    const bookKeys = Object.keys(books);

    // iterate through books and find matches
    for (const key of bookKeys) {
      const book = books[key];
      if (book.title.toLowerCase() === requestedTitle.toLowerCase()) { // sase-insensitive comparison
        matchingBooks.push(book);
      }
    }

    if (matchingBooks.length > 0) {
      res.json(matchingBooks); // send matching books in a JSON response
    } else {
      res.status(404).json({ message: "No books found with that title" }); // handle no books found
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving books" }); // handle unexpected errors
  }
});

// task. 5
//  get a book review
public_users.get('/review/:isbn',function (req, res) {
  try {
    const requestedIsbn = req.params.isbn; // retrieve ISBN from request parameters
    const book = books[requestedIsbn];

    if (book) {
      const reviews = book.reviews;
      res.json(reviews); // send the book reviews as a JSON response
    } else {
      res.status(404).json({ message: "Book not found" }); // handle book not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving reviews" }); // handle unexpected errors
  }
});

// task 10 to 13 "common functionality"
// function to fetch the book list using the promise callback
function getBookListWithPromise(url) {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
}

// task 10 to 13 "common functionality"
// function to fetch book list using the async-await method
async function getBookListAsync(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error; // re-throw the error for handling in the route
  }
}


// task 10 with a Promise
public_users.get('/promise', function (req, res) {
  try {
    getBookListWithPromise('http://localhost:5000/') 
      .then(bookList => {
        res.json(bookList);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book list" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error" });
  }
});


// task 10 with async
public_users.get('/async', async function (req, res) {
  try {
    const bookList = await getBookListAsync('http://localhost:5000/'); //
    res.json(bookList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book list" });
  }
});


// task 11 with promise
public_users.get('/promise/isbn/:isbn', function (req, res) {
  try {
    const requestedIsbn = req.params.isbn;
    getBookListWithPromise("http://localhost:5000/isbn/" + requestedIsbn) 
      .then(book => {
        res.json(book);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error" });
  }
});


// task 11 with async
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const requestedIsbn = req.params.isbn;
    const book = await getBookListAsync("http://localhost:5000/isbn/" + requestedIsbn);
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book details" });
  }
});


// task 12 with promise
public_users.get('/promise/author/:author', function (req, res) {
  try {
    const requestedAuthor = req.params.author;
    getBookListWithPromise("http://localhost:5000/author/" + requestedAuthor) 
      .then(book => {
        res.json(book);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error" });
  }
});


// task 12 with async
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const requestedAuthor = req.params.author;
    const book = await getBookListAsync("http://localhost:5000/author/" + requestedAuthor);
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book details" });
  }
});


// task 13 with promise
public_users.get('/promise/title/:title', function (req, res) {
  try {
    const requestedTitle = req.params.title;
    getBookListWithPromise("http://localhost:5000/title/" + requestedTitle) 
      .then(book => {
        res.json(book);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error" });
  }
});


// task 13 with async
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const requestedTitle = req.params.title;
    const book = await getBookListAsync("http://localhost:5000/title/" + requestedTitle);
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book details" });
  }
});

module.exports = {
  general: public_users,
  getBookListWithPromise,
  getBookListAsync
};