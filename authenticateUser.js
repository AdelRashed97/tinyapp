const bcrypt = require("bcrypt");
const {findUserByEmail} = require("./findUserByEmail");

const authenticateUser = function(email,password,users) {
  const user = findUserByEmail(email,users);

  if (user && bcrypt.compareSync(password,user.password)) {
    // user.password is hashed
    return user;
    
  }

  return false;

};

module.exports = {authenticateUser};