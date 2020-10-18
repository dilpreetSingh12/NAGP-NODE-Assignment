const expect = require('chai').expect;
const sinon = require('sinon');

const User = require('../models/user');
const UserCtrl = require('../controller/user');
const Auth = require('../middlewares/auth');


describe('User Controller - createUser', function () {
    it('user added', function (done) {
      const user ={
        firstname: "dhkdkh",
        lastname: "dhjdkj",
        email: "ssj@n.com",
        username: "dhkdkhd",
        password: "fkkfh",
        role: "dhkdkh",
        };
      newUser = new User(user)
  
  
      const req = {
        body:user
      };

      const res = {
        redirect:function(body){
            return body;
        }
      };
      sinon.spy(res, 'redirect');

      sinon.stub(UserCtrl, 'getNewUser');
      UserCtrl.getNewUser.returns(newUser);
     
      sinon.stub(newUser, 'save');
      sinon.stub(newUser, 'setHashPassword');
      newUser.save.returns({});
      newUser.setHashPassword.returns({});

      UserCtrl
        .createUser(req, res, () => {})
        .then(function () {
          expect(res.redirect.called).to.be.true;
          expect(res.redirect.calledWith('/auth/login')).to.be.true;
          done();
        });
  
        newUser.setHashPassword.restore();
        UserCtrl.getNewUser.restore();
      newUser.save.restore();
    });
  
});

