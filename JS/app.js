// creating relevant variables
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const app = express();

app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true
}));

app.use(express.urlencoded({ extended: true }));
// establishing connection to MySQL DB
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mikaugames2403!',
  database: 'users'
});

function validateForm() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  // Check if the username and password match the ones stored in the database
  if (username === "admin" && password === "password") {
    return true; // Allow the form submission
  } else {
    document.getElementById("error-message").style.display = "block"; // Display error message
    return false; // Prevent the form submission
  }
}


// Create-Account, insertion into db table
app.get('../HTML/create-account.html', (req, res) => {
  const { username, password } = req.body;

  const errors = validateForm(username, password);

  if (errors.length > 0) {
    res.send(errors.join('\n'));
    return;
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.log(err);
      res.send('Error registering user');
    } else {
      connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err, result) => {
        if (err) {
          console.log(err);
          res.send('Error registering user');
        } else {
          res.redirect('../HTML/login-form.html');
        }
      });
    }
  });
});

// fetch from db and compare to login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.log(err);
      res.send('Error logging in');
    } else if (results.length === 0) {
      res.send('Invalid username or password');
    } else {

      bcrypt.compare(password, results[0].password, (err, result) => {
        if (err) {
          console.log(err);
          res.send('Error logging in');
        } else if (result) {

          req.session.userId = results[0].id;
          res.redirect('../HTML/main.html');
        } else {
          res.send('Invalid username or password');
        }
      });
    }
  });
});



