const chai = require("chai");
const mongoose = require("mongoose");
const chaiHttp = require("chai-http");
const auth = require("../src/authenticate");
//const assert = require("chai").assert;
const expect = require("chai").expect;
//const should = require("chai").should();
const server = require("../src/index");
const Course = require("../src/models/course").Course;
const User = require("../src/models/user").User;
const Review = require("../src/models/review").Review;
//const bcrypt = require("bcrypt");

//test suite
chai.use(chaiHttp);

describe('extra credit get user', () => {
    beforeEach(function(done) {
    this.timeout(3000); 
    setTimeout(done, 2500);
  });

    
    it('should return authorised user', (done) =>{
        chai.request(server)
            .get("/api/users")
            .set('Accept', 'application/json')
            .set('Authorization', 'Basic am9lQHNtaXRoLmNvbTpwYXNzd29yZA==')
            .auth("john@smith.com", "password")
            .end(function(err, res){
                
                expect(res).to.have.status(200);
                expect(res.body._id).to.equal("5bd91b398dc82d12f0ed2fee");
                done();
            })
        });


    it("should return 401 if there are invalid credentials", (done) => {
        chai.request(server)
            .get("/api/courses/57029ed4795118be119cc43d")
            .set('Accept', 'application/json')
            .set('Authorization', 'Basic am9lQHNtaXRoLmNvbTpwYXNzd29yZA==')
            .auth("john@smith.com", "passwordmmmmmmmmmmmmmmmmmmmmmmmmmmmmm")
            .end(function(err, res){
                    expect(res).to.have.status(401);
                    done();
                
            })
        });
    })
//})

