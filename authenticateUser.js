const {findUserByEmail} = require("./findUserByEmail");

const authenticateUser = function(email,password,users) {
  const user = findUserByEmail(email,users);

  if (user && user.password === password) {
    return user;

  }

  return false;

}