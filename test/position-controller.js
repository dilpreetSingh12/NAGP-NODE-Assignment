const expect = require('chai').expect;
const sinon = require('sinon');

const Position = require('../models/position');
const PositionCtrl = require('../controller/position');
const Auth = require('../middlewares/auth');



describe('Position Controller - getAllPositions', function () {
  it('should fetch a list of positions', function (done) {
    const positions = [
      {
        projectname: "Nagarro",
        clientname: "Nagarro",
        technologies: "Node",
        role: "Dev",
        jobdescription: "Dev",
        status: true,
        createdby: "48787489YRHFKJ",
        appliedBy:["894848IJFKFJ"],
      },
    ];

    sinon.stub(Position, 'find');
    Position.find.returns(positions);

    sinon.stub(Auth, 'getUserRole');
    sinon.stub(Auth, 'getUserID');

    Auth.getUserRole.returns("Manager");
    Auth.getUserID.returns("123");

    const res = {
      render:function(body){
          return body;
      }
    };
    sinon.spy(res, 'render');

    PositionCtrl
      .getAllPositions({}, res, () => {})
      .then(function () {
        expect(res.render.called).to.be.true;
        expect(res.render.calledWith('position/getPositions', { title: 'Positions', positions: positions, isUserLoggedIn: true,isManager:true,userID:"123"})).to.be.true;
        done();
      });

    Position.find.restore();
    Auth.getUserRole.restore();
    Auth.getUserID.restore();
  });

  it('should not fetch a list of positions', function (done) {
    const positions = [
      {
        projectname: "Nagarro",
        clientname: "Nagarro",
        technologies: "Node",
        role: "Dev",
        jobdescription: "Dev",
        status: true,
        createdby: "48787489YRHFKJ",
        appliedBy:["894848IJFKFJ"],
      },
    ];

    sinon.stub(Position, 'find').throws();
    // Position.find.returns(new Error("error"));

    sinon.stub(Auth, 'getUserRole');
    sinon.stub(Auth, 'getUserID');

    Auth.getUserRole.returns("Manager");
    Auth.getUserID.returns("123");

    statusReturn={
        send:function(body){
            return body;
        }
    }
    const res = {
      render:function(body){
          return body;
      },
      status:function(body){
          return statusReturn;
      },

    };
    sinon.spy(res, 'render');
    sinon.spy(res, 'status');
    sinon.spy(statusReturn, 'send');

    PositionCtrl
      .getAllPositions({}, res, () => {})
      .then(function () {
        expect(res.render.called).to.be.false;
        expect(res.status.called).to.be.true;
        expect(statusReturn.send.called).to.be.true;
        expect(res.status.calledWith(500)).to.be.true;
        expect(statusReturn.send.calledWith("Something went wrong! Please try again.")).to.be.true;
        done();
      });

    Position.find.restore();
    Auth.getUserRole.restore();
    Auth.getUserID.restore();
  });
});

describe('Position Controller - getMyOpenings', function () {
    it('should fetch a list of positions', function (done) {
      const positions = [
        {
          projectname: "Nagarro",
          clientname: "Nagarro",
          technologies: "Node",
          role: "Dev",
          jobdescription: "Dev",
          status: true,
          createdby: "48787489YRHFKJ",
          appliedBy:["894848IJFKFJ"],
        },
      ];
  
      sinon.stub(Position, 'find');
      Position.find.returns(positions);
  
      sinon.stub(Auth, 'getUserRole');
      sinon.stub(Auth, 'getUserID');
  
      Auth.getUserRole.returns("employee");
      Auth.getUserID.returns("123");
  
      const res = {
        render:function(body){
            return body;
        }
      };
      sinon.spy(res, 'render');
  
      PositionCtrl
        .getMyOpenings({}, res, () => {})
        .then(function () {
          expect(res.render.called).to.be.true;
          expect(res.render.calledWith('position/getPositions', { title: 'Positions', positions: positions, isUserLoggedIn: true,isManager:false})).to.be.true;
          done();
        });
  
      Position.find.restore();
      Auth.getUserID.restore();
      Auth.getUserRole.restore();
    });
});

describe('Position Controller - getPositionByID', function () {
    it('should fetch a position', function (done) {
      const positions = {
          projectname: "Nagarro",
          clientname: "Nagarro",
          technologies: "Node",
          role: "Dev",
          jobdescription: "Dev",
          status: true,
          createdby: "48787489YRHFKJ",
          appliedBy:["894848IJFKFJ"],
        };
  
      sinon.stub(Position, 'findById');
      Position.findById.returns(positions);
  
      sinon.stub(Auth, 'getUserRole');
      sinon.stub(Auth, 'getUserID');
  
      Auth.getUserRole.returns("Manager");
      Auth.getUserID.returns("123");
  
      const res = {
        render:function(body){
            return body;
        }
      };
      const req={
        params:{
            id:1,
        }
    };
      sinon.spy(res, 'render');
  
      PositionCtrl
        .getPositionByID(req, res, () => {})
        .then(function () {
          expect(res.render.called).to.be.true;
          expect(res.render.calledWith('position/positionDetails', { title: positions.role, position: positions, isUserLoggedIn: true,isManager:true,userID:"123" })).to.be.true;
          done();
        });
  
      Position.findById.restore();
      Auth.getUserRole.restore();
      Auth.getUserID.restore();
    });
  
});

describe('Position Controller - getPositionByIDToUpdate', function () {
    it('should fetch a position', function (done) {
      const positions = {
          projectname: "Nagarro",
          clientname: "Nagarro",
          technologies: "Node",
          role: "Dev",
          jobdescription: "Dev",
          status: true,
          createdby: "48787489YRHFKJ",
          appliedBy:["894848IJFKFJ"],
        };
  
      sinon.stub(Position, 'findById');
      Position.findById.returns(positions);
  
      const res = {
        render:function(body){
            return body;
        }
      };
      const req={
        params:{
            id:1,
        }
    };
      sinon.spy(res, 'render');
  
      PositionCtrl
        .getPositionByIDToUpdate(req, res, () => {})
        .then(function () {
          expect(res.render.called).to.be.true;
          expect(res.render.calledWith('position/update', { put: true, title: positions.role, position: positions, isUserLoggedIn: true })).to.be.true;
          done();
        });
  
      Position.findById.restore();
    });
  
});

describe('Position Controller - createPosition', function () {
    it('position added', function (done) {
      const position ={
          projectname: "Nagarro",
          clientname: "Nagarro",
          technologies: "Node",
          role: "Dev",
          jobdescription: "Dev",
          status: true,
          createdby: "48787489YRHFKJ",
          appliedBy:["894848IJFKFJ"],
        };
  newPos = new Position(position)
  
      sinon.stub(Auth, 'getUserRole');
      sinon.stub(Auth, 'getUserID');
  
      Auth.getUserID.returns("123");
  
      const req = {
        body:position
      };

      const res = {
        redirect:function(body){
            return body;
        }
      };
      sinon.spy(res, 'redirect');

      sinon.stub(PositionCtrl, 'getNewPosition');
      PositionCtrl.getNewPosition.returns(newPos);
     
      sinon.stub(newPos, 'save');
      newPos.save.returns({});

      PositionCtrl
        .createPosition(req, res, () => {})
        .then(function () {
          expect(res.redirect.called).to.be.true;
          expect(res.redirect.calledWith('/positions/position')).to.be.true;
          done();
        });
  
        PositionCtrl.getNewPosition.restore();
      newPos.save.restore();
      Auth.getUserID.restore();
    });
  
});

describe('Position Controller - updatePosition', function () {
    it('position updated', function (done) {
      const position ={
          projectname: "Nagarro",
          clientname: "Nagarro",
          technologies: "Node",
          role: "Dev",
          jobdescription: "Dev",
          status: true,
          createdby: "48787489YRHFKJ",
          appliedBy:["894848IJFKFJ"],
        };
        sinon.stub(Position, 'findByIdAndUpdate');
        Position.findByIdAndUpdate.returns({_id:"77jfj"});
  
      const req = {
        body:position,
        params:{
            id:"123"
        }
      };

      const res = {
        redirect:function(body){
            return body;
        }
      };
      sinon.spy(res, 'redirect');

      PositionCtrl
        .updatePosition(req, res, () => {})
        .then(function () {
          expect(res.redirect.called).to.be.true;
          expect(res.redirect.calledWith('/positions/position/77jfj')).to.be.true;
          done();
        });
        Position.findByIdAndUpdate.restore();
    });
  
});
