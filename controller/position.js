const { validationResult } = require('express-validator/check');

const Position = require('../models/position');
const positionValidation = require('../middlewares/position');
const auth = require('../middlewares/auth');
const { getUserID } = require('../middlewares/auth');

const events = require('events');
const eventEmitter = new events.EventEmitter();


//Assign the event handler to an event:
eventEmitter.on('applied', function (userID,createdByID) {
    if (userID===createdByID){
        console.log('A person just applied on your posted job');
    }
 });


function getNewPosition(body){
    return new Position(body)
}

async function createPosition(req, res, next) {
    try {
        const errors = validationResult(req)
        const position = req.body;
        const newPosition = getNewPosition(req.body);
        newPosition.createdby = auth.getUserID(req, res, next);
        newPosition.status = true
        if (!errors.isEmpty()) {
            const projectNameErr = errors.array().find(e => e.msg === positionValidation.fieldRequired)
            const clientNameErr = errors.array().find(e => e.msg === positionValidation.fieldRequired)
            const roleErr = errors.array().find(e => e.msg === positionValidation.roleRequired)
            const technologiesErr = errors.array().find(e => e.msg === positionValidation.fieldRequired)
            const jobDescriptionErr = errors.array().find(e => e.msg === positionValidation.fieldRequired)
            res.render('position/create', {
                title: 'Create Position',
                position,
                projectNameErr,
                clientNameErr,
                roleErr,
                technologiesErr,
                createdByErr,
                jobDescriptionErr
            })
        } else {
                newPosition.save({});
                res.redirect('/positions/position')
        }

    } catch (error) {
        res.status(500).send("Something went wrong! Please try again.")
    }
}

async function getAllPositions(req, res, next) {
    const userRole = auth.getUserRole(req, res, next)
    const userID = auth.getUserID(req, res, next)
    isManager= (userRole.toLowerCase()=="manager")
    try {
        const positions = await Position.find({});
        res.render('position/getPositions', { title: 'Positions', positions: positions, isUserLoggedIn: true,isManager:isManager,userID:userID})
      } catch (err) {
        return res.status(500).send("Something went wrong! Please try again.")
      }
}

async function getMyOpenings(req, res, next) {
    const userRole = auth.getUserRole(req, res, next)
    const userID = auth.getUserID(req, res, next)
    isManager= (userRole.toLowerCase()=="manager")
    try {
        const positions = await Position.find({ 'createdby': userID });
        res.render('position/getPositions', { title: 'Positions', positions: positions, isUserLoggedIn: true, isManager:isManager })
      } catch (err) {
        return res.status(500).send("Something went wrong! Please try again.")
      }
}


async function getPositionByID(req, res, next) {
    const userRole = auth.getUserRole(req, res, next)
    const userID = auth.getUserID(req, res, next)
    isManager= (userRole.toLowerCase()=="manager")

    try {
        const position = await Position.findById(req.params.id);
        return res.render('position/positionDetails', { title: position.role, position: position, isUserLoggedIn: true,isManager:isManager,userID:userID })
      } catch (err) {
        return res.status(500).send("Something went wrong! Please try again.")
      }
}

async function getPositionByIDToUpdate(req, res, next) {
    try {
        const position = await Position.findById(req.params.id);
        return res.render('position/update', { put: true, title: position.role, position: position, isUserLoggedIn: true })
      } catch (err) {
        return res.status(500).send("Something went wrong! Please try again.")
      }
}

async function updatePosition(req, res, next) {
    const id = req.params.id
    try{
        const pos = await Position.findByIdAndUpdate(
            { "_id": id },
            {
                $set: {
                    'projectname': req.body.projectname,
                    'clientname': req.body.clientname,
                    'technologies': req.body.technologies,
                    'jobdescription': req.body.jobdescription,
                    'role': req.body.role,
                    'status': req.body.status,
                }
            },
            { new: true })
            return res.redirect('/positions/position/' + pos._id)
    } catch(err){
        return res.status(500).send("Something went wrong! Please try again.")
    }   
}

async function applyForPosition(req, res, next) {
    const userID = auth.getUserID(req, res, next)
    const id = req.params.id
    try{
        var pos = await Position.findById(id)
        pos.appliedBy.push(userID)
        const data = await Position.findByIdAndUpdate(
            { "_id": id },
            {
                $set: {
                    'projectname': pos.projectname,
                    'clientname': pos.clientname,
                    'technologies': pos.technologies,
                    'jobdescription': pos.jobdescription,
                    'role': pos.role,
                    'status': pos.status,
                    'appliedBy':pos.appliedBy,
                },
            },
            {new:true})
            return res.redirect('/positions/position/' + data._id)
    }catch(err){
        return res.status(500).send("Something went wrong! Please try again.")
    }
}

module.exports = {
    getNewPosition,
    createPosition,
    getAllPositions,
    getPositionByID,
    getPositionByIDToUpdate,
    getMyOpenings,
    updatePosition,
    applyForPosition
}
