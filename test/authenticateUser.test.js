const {assert} = require("chai");
const bcrypt = require("bcrypt");
const {authenticateUser} = require("../authenticateUser");

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur",10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk",10)
  }
};

describe('authenticateUser', function() {
  it('should return a user with valid email and valid password', function() {
    const user = authenticateUser("user@example.com", "purple-monkey-dinosaur",testUsers);
    const expectedUser = testUsers["userRandomID"];
    assert.deepEqual(user,expectedUser);
    
   
  });

  it('should return false  with valid email and invalid password', function() {
    const result = authenticateUser("user@example.com", "purple-monkey",testUsers);
    const expected = false;
    assert.equal(result,expected);
  
   
  });

  it('should return false  with invalid email and valid password', function() {
    const result = authenticateUser("user2@example.com", "purple-monkey-dinosaur",testUsers);
    const expected = false;
    assert.equal(result,expected);
  
   
  });

  it('should return false  with invalid email and invalid password', function() {
    const result = authenticateUser("user4@example.com", "purple-monkey",testUsers);
    const expected = false;
    assert.equal(result,expected);
  
   
  });
});