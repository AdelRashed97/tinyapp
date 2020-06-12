const isUserAllowed = function(action,shortUrl,userID,urlDatabase,req,res) {
  // action is either update or delete
  const url = urlDatabase[shortUrl];
  if (userID) {
    // check if the user is logged in
    if (url) {
      // check if the url exists
      if (url["userID"] === userID) {
        // check if the current user is the owner/creator of the url

        // updates the url
        if (action === "update") {
          
          urlDatabase[shortUrl]["longURL"] = req.body.longURL;
  
          res.redirect("/urls");
        } else if (action === "delete") {
          delete urlDatabase[shortUrl];
          res.redirect("/urls");
        }

 
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
};

module.exports = {isUserAllowed};