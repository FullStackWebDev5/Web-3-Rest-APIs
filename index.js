const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config()

const app = express();
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("./public"));

const User = mongoose.model('User', {
	username: String,
	firstName: String,
	lastName: String,
	imageURL: String,
	age: Number
})

app.get("/", (req, res) => {
	User.find()
		.then((users) => { 
			res.render("users", { users });
		})
		.catch((error) => res.json({ error }));
});

app.get("/users/:username", (req, res) => {
	const { username } = req.params
	User.find({ username })
		.then((users) => { 
			if(!users[0]) {
				res.send('User not found')
			}
			res.render("user", users[0]);
		})
		.catch((error) => res.json({ error }));
});

app.get('/create-user', (req, res) => {
	res.render('createUser')
})

/* -------------------------------- */
// REST APIS
/* -------------------------------- */
app.get("/api/users", (req, res) => {
	User.find()
    .then((users) => res.json(users))
    .catch((error) => res.json({ error }));
});

app.get("/api/users/:username", (req, res) => {
	const { username } = req.params
	User.find({ username })
    .then((users) => res.json(users))
    .catch((error) => res.json({ error }));
});

app.post("/api/users", (req, res) => {
  const { username, firstName, lastName, imageURL, age } = req.body;
  const newUser = new User({ username, firstName, lastName, imageURL, age });
  newUser
    .save()
    .then(() => res.redirect('/'))
    .catch((error) => res.json({ error }));
});

app.put("/api/users/:id", (req, res) => {
	const { id } = req.params;
  const { username, firstName, lastName, imageURL, age } = req.body;
  User.findByIdAndUpdate(id, { username, firstName, lastName, imageURL, age })
    .then(() => res.json({ status: "SUCCESS" }))
    .catch((error) => res.json({ error }));
});

app.delete("/api/users/:id", (req, res) => {
	const { id } = req.params;
  User.findByIdAndDelete(id)
    .then(() => res.json({ status: "SUCCESS" }))
    .catch((error) => res.json({ error }));
});

app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() =>
      console.log(`Server running on http://localhost:${process.env.PORT}`)
    )
    .catch((err) => console.log(err));
});





















/*
	REST: Representational State Transfer
		- Standarized representation for APIs

	HTTP Methods: (CRUD oprations)
	- GET (R)
	- POST (C)
	- PUT/PATCH (U)
	- DELETE (D)

	Eg: E-Commerce Site
	- APIs for Customers (CRUD)
	- APIs for Products (CRUD)

	#Customers
	- R: GET /customers
	- C: POST /customers
	- U: PUT/PATCH /customers/:id
	- D: DELTE /customers/:id

	#Products
	- R: GET /products
	- C: POST /products
	- U: PUT/PATCH /products/:id
	- D: DELTE /products/:id

	...
*/
