var request = require('request')
  , expect = require('chai').expect
  , cheerio = require('cheerio')


//GET REQUEST

  describe('http://localhost:3000/api/users/', function() {
    it('should have a HTTP of 200 - success', function(done) {
      var theUsers;
      request.get('http://localhost:3000/api/users', {users:{
        username:"",
        password:"",
      }}, function(err, res, body) {
        theUsers = body;
        expect(res.statusCode).to.equal(200);
        // expect(res.statusCode).to.equal(404)
        console.log("Extracted user " + theUsers);
        done();
      });
    });
  });  

// POST REQUEST


describe('http://localhost:3000/api/users', function() {
  it('should have a HTTP of 200 - success', function(done) {
    var newUser;
    request.post('http://localhost:3000/api/users', {users:{
      username: "johndoe",
      password: "123abc",
    }}, function(err, res, body) {
      newUser = body;
      expect(res.statusCode).to.equal(200);
       // expect(res.statusCode).to.equal(404)
      console.log("Added new user " + newUser);
      done();
    });
  });
});  


// // DELETE REQUEST

describe('http://localhost:3000/api/users', function() {
  it('should have a HTTP of 200 - success', function(done) {
    var deleted;
    request.del('http://localhost:3000/api/users/', {users:{
    	username: "johndoe",
    	password: "123abc",
    }}, function(err, res, body) {
      expect(res.statusCode).to.equal(200);
      // expect(res.statusCode).to.equal(404)
      deleted = body;
      console.log(deleted + " has been deleted!");
      done();
    });
  });
}); 