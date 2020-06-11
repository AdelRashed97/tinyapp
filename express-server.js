const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const bycrpt = require("bcrypt");
const cookieSession = require("cookie-session");
const {generateRandomString} = require("./generateRandomString");
const {findUserByEmail} = require("./findUserByEmail");
const {authenticateUser} = require("./authenticateUser");
const {urlsForUser} = require("./urlsForUser");

const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("dev"));

app.use(cookieSession({
  name: 'session',
  keys: ['f080ac7b-b838-4c5f-a1f4-b0a9fee10130', 'c3fb18be-448b-4f6e-a377-49373e9b7e1a']
}));




// Databases
const urlDatabase = {
  "b2xVn2": {longURL:"http://www.lighthouselabs.ca",userID:"DDEEFF"},
  "9sm5xK": {longURL :"http://www.google.com", userID:"AABBCC"}
};

const users = {"AABBCC":{
  id:"AABBCC",
  email:"mike@example.ca",
  password:bycrpt.hashSync("12345",10)
},
"DDEEFF": {
  id : "DDEEFF",
  email :"sara@example.ca",
  password : bycrpt.hashSync("98765",10)
}

};

// Get Requests
app.get("/", (req, res) => {
  const userID = req.session["user_id"];
  if (userID) {
    res.redirect("/urls");
  } {
    res.redirect("/login");
  }

});

app.get("/register",(req,res) => {
  const userID = req.session["user_id"];
  if (userID) {
    // check if user is logged in
    res.redirect("/urls");
  } else {
    
    let templateVars = { user:users[userID] };
    res.render("register",templateVars);
  }

});

app.get("/login",(req,res) => {

  const userID = req.session["user_id"];
  if (userID) {
    // check if user is logged in
    res.redirect("/urls");
  } else {
    
    let templateVars = { user:users[userID] };
    res.render("login",templateVars);
  }
});

app.get("/urls", (req, res) => {
  const userID = req.session["user_id"];
  if (userID) {
    // check if the user is logged in
    
    const userUrls = urlsForUser(userID,urlDatabase);
    let templateVars = { user:users[userID],urls:userUrls };
    res.render("urls_index", templateVars);
  } else {
    res.status(403);
    res.send('<p> Access Denied. Either <a href ="/login">Login</a> or <a href ="/register">Register</a> </p>');
  }
});

app.get("/urls/new", (req, res) => {
  const userID = req.session["user_id"];
  if (userID) {
    // check if the user is logged in
    let templateVars = {user:users[userID]};
    res.render("urls_new",templateVars);

  } else {
    res.redirect("/login");
  }
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const url = urlDatabase[shortURL];
  if (url) {
    //checks if the url object exist
    const longURL = url.longURL;
    res.redirect(longURL);

  } else {

    // the url does not exist in the database
    res.status(400);
    res.send("The url requested does not exist");

  }

}
);

app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session["user_id"];
  const shortURL = req.params.shortURL;
  const url = urlDatabase[shortURL];
  if (userID) {
    // check if the user is logged in
    if (url) {
      // check if the url exists
      if (url["userID"] === userID) {
        // check if the current user is the owner/creator of the url
        let templateVars = { user:users[userID],shortURL, longURL: url["longURL"] };
        res.render("url_show",templateVars);
 
      } else {
        // if the current user is not the creator of url
        res.status(403);
        res.send("Access Denied. The requested url belongs to another account");
      }
  
    } else {
      // the url does not exist in the database
      res.status(400);
      res.send("The url requested does not exist");
    }
      
  } else {
    // user is not logged in
    res.status(403);
    res.send('<p> Access Denied. Either <a href ="/login">Login</a> or <a href ="/register">Register</a> </p>');
  }
}

);



/*********************************************************************************************** */

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
    const newUser = {"id":userID,email,password:bycrpt.hashSync(password,10)};
    users[userID] = newUser;
    console.log(users);
    req.session["user_id"] = userID;
    res.redirect("/urls");
  }



});


app.post("/login",(req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = authenticateUser(email,password,users);
  if (user) {
    req.session["user_id"] = user["id"];
    res.redirect("/urls");
  } else {
    res.status(403);
    res.send('Error !!! Either the email or password is wrong. Please try again <a href ="/login">Login</a>');
  }
});

app.post("/logout",(req,res) => {
  req.session["user_id"] = null;
  res.redirect("/urls");
});



//Post Request to create new short url
app.post("/urls", (req, res) => {
  const userID = req.session["user_id"];
  if (userID) {
    //check if the user is logged in
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = {longURL:req.body.longURL, userID};
    console.log(urlDatabase);
    res.redirect(`/urls/${shortURL}`);
 
  } else {

    // user is not logged in
    res.status(403);
    res.send('<p> Access Denied. Either <a href ="/login">Login</a> or <a href ="/register">Register</a> </p>');

  }

});

//Post Request to delete new short url
app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.session["user_id"];
  const shortURL = req.params.shortURL;
  const url = urlDatabase[shortURL];
  if (userID) {
    // check if the user is logged in
    if (url) {
      // check if the url exists
      if (url["userID"] === userID) {
        // check if the current user is the owner/creator of the url

        // deletes the url

        delete urlDatabase[shortURL];
        res.redirect("/urls");
 
      } else {
        // if the current user is not the creator of url
        res.status(403);
        res.send("Access Denied. The requested url belongs to another account");
      }
  
    } else {
      // the url does not exist in the database
      res.status(400);
      res.send("The url requested does not exist");
    }
      
  } else {
    // user is not logged in
    res.status(403);
    res.send('<p> Access Denied. Either <a href ="/login">Login</a> or <a href ="/register">Register</a> </p>');
  }
}




);




//Post Request to update new short url
app.post("/urls/:shortURL", (req, res) => {
  const userID = req.session["user_id"];
  const shortURL = req.params.shortURL;
  const url = urlDatabase[shortURL];
  if (userID) {
    // check if the user is logged in
    if (url) {
      // check if the url exists
      if (url["userID"] === userID) {
        // check if the current user is the owner/creator of the url

        // updates the url

        urlDatabase[shortURL]["longURL"] = req.body.longURL;

        res.redirect("/urls");
 
      } else {
        // if the current user is not the creator of url
        res.status(403);
        res.send("Access Denied. The requested url belongs to another account");
      }
  
    } else {
      // the url does not exist in the database
      res.status(400);
      res.send("The url requested does not exist");
    }
      
  } else {
    // user is not logged in
    res.status(403);
    res.send('<p> Access Denied. Either <a href ="/login">Login</a> or <a href ="/register">Register</a> </p>');
  }
}

);
















app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});





