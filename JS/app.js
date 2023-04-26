const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const app = express();


app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true
}));

app.use(express.urlencoded({ extended: true }));


const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'myuser',
  password: 'mypassword',
  database: 'mydatabase'
});


const requireAuth = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
};


app.post('/register', (req, res) => {
  const { username, password } = req.body;

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
          res.redirect('/login');
        }
      });
    }
  });
});


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
          res.redirect('/dashboard');
        } else {
          res.send('Invalid username or password');
        }
      });
    }
  });
});


app.get('/dashboard', requireAuth, (req, res) => {
  res.send('Welcome to your dashboard!');
});


app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
      res.send('Error logging out');
    } else {
      res.redirect('/login');
    }
  });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/validate', (req, res) => {
  const { username, password } = req.body;

  connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.log(err);
      res.send('Error validating user');
    } else if (results.length === 0) {
      res.send('Invalid username or password');
    } else {

      bcrypt.compare(password, results[0].password, (err, result) => {
        if (err) {
          console.log(err);
          res.send('Error validating user');
        } else if (result) {
          res.send('Valid user');
        } else {
          res.send('Invalid username or password');
        }
      });
    }
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

""

