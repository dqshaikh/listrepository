const express = require("express");
const path = require('path');
const cors = require("cors");
require("dotenv").config();
const app = express();
let ejs = require('ejs');

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

db.sequelize.sync();
// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
app.get("/test", (req, res) => {
  res.json({ message: "Application running on http://localhost:3000/." });
});


//app.set('views', path.join(__dirname, 'views'));
app.set('views', './app/views');
app.set('view engine', 'ejs');


//res.sendFile(path + "index.html", {data: "ok"});
// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname, 'app/views/index.ejs'));
// });

app.get('/search', function(req, res) {
 // UsersController.insert
  res.render('index', { type: "main" });
});

app.get('/repo:name', function(req, res) {
  // UsersController.insert
   res.render('index', { type: "repo" });
 });

require("./app/routes/routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
