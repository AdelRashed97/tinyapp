const urlsForUser = function(userID,urlDatabase) {
  const userUrls = {};
  for (const urlID in urlDatabase) {
    if (urlDatabase[urlID]["userID"] === userID) {
      userUrls[urlID] = urlDatabase[urlID];
    }
  }

  return userUrls;
};


module.exports = {urlsForUser};