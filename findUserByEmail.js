const findUserByEmail = function(email,users) {
  // users is an object
  for (const userID in users) {
    if (users[userID].email === email) {
      return users[userID];
    }
  }

  return false;
};


module.exports = {findUserByEmail};