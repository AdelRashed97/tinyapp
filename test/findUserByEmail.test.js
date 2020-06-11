const {assert} = require("chai");
const {findUserByEmail} = require("../findUserByEmail");

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUserByEmail("user@example.com", testUsers);
    const expectedUser = testUsers["userRandomID"];
    assert.deepEqual(user,expectedUser);
    
   
  });
  it('should false  with invalid email', function() {
    const result = findUserByEmail("user3@example.com", testUsers);
    const expected = false;
    assert.equal(result,expected);
  
   
  });
});