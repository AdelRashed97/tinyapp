const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const {generateRandomString} = require("./generateRandomString");
const {findUserByEmail} = require("./findUserByEmail");

const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("dev"));
app.use(cookieParser());





// Databases
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {};

// Get Requests
app.get("/", (req, res) => {
  res.send("Hello!");

});

app.get("/register",(req,res) => {
  res.render("register");
});

app.get("/urls", (req, res) => {
  let templateVars = { user:users[req.cookies["user_id"]],urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {user:users[req.cookies["user_id"]]};
  res.render("urls_new",templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
}
);

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[req.params.shortURL];
  let templateVars = { user:users[req.cookies["user_id"]],shortURL, longURL };
  res.render("url_show",templateVars);
}
);

app.get("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[req.params.shortURL];
  let templateVars = { user:users[req.cookies["user_id"]],shortURL, longURL };
  res.render("url_show",templateVars);
}
);

/*********************************************************************************************** */
//Post Request to create new short url
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);

});

//Post Request to delete new short url
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
}
);

//Post Request to update new short url
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls");
}
);
app.post("/login",(req,res) => {
  const userName = req.body.username;
  //res.cookie("username",userName);
  res.redirect("/urls");
});

app.post("/logout",(req,res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.post("/register",(req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email === "" || password === "") {
    res.status(400);
    res.send("Please input a valid email and password");
  } else if (findUserByEmail(email,users)) {
  
    //checks if email is already used by another user.
    res.status(400);
    res.send("The email address is not available.Please input a different  email.");

  } else {
    
    const userID = generateRandomString();
    const newUser = {"id":userID,email,password};
    users[userID] = newUser;
    console.log(users);
    res.cookie("user_id",userID);
    res.redirect("/urls");
  }

});




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});





