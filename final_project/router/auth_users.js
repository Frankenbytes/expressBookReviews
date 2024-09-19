const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ // returns a boolean
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

// Task 7
// registered users login
regd_users.post("/login", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Task 8
// Add book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  try {
    const requestedIsbn = req.params.isbn;
    const reviewText = req.query.review;
    const username = req.session.authorization.username; // Assumed username is stored in the session

    if (!username) {
      return res.status(401).json({ message: "Unauthorized" }); // handle unauthorized access
    }

    const book = books[requestedIsbn];

    if (book) {
      book.reviews[username] = reviewText; // Add / modify review based on username
      res.json({ message: "Review added/modified successfully" });
    } else {
      res.status(404).json({ message: "Book not found" }); // handle book if it is not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding/modifying review" }); // handle unexpected errors
  }
});

// task 9
regd_users.delete("/auth/review/:isbn", (req, res) => {
  try {
    const requestedIsbn = req.params.isbn;
    const username = req.session.authorization.username; // retrieve the username from session

    if (!username) {
      return res.status(401).json({ message: "Unauthorized" }); // handle unauthorized access
    }

    const book = books[requestedIsbn];

    if (book) {
      if (book.reviews[username]) { // Check if a review already exist for the user
        delete book.reviews[username]; // Delete the review of the user
        res.json({ message: "Review deleted successfully" });
      } else {
        res.status(404).json({ message: "Review not found" }); // handle if review is not found
      }
    } else {
      res.status(404).json({ message: "Book not found" }); // handle if book not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting review" }); // handle other unexpected errors
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;