const express = require('express');
const router = express.Router();
const methodOverride = require("method-override");

const Position = require('../models/position');
const auth = require('../middlewares/auth')
const positionMiddleware = require('../middlewares/position')
const positionController = require('../controller/position');

router.use(methodOverride("_method", {
    methods: ["POST", "GET"]
}));

/* Creates a new position */
router.post('/create', auth.isUserManager(), positionMiddleware.validate('createPosition'), positionController.createPosition);


/* Get all positions */
router.get('/position', positionController.getAllPositions);

/* Get all positions by Manager */
router.get('/myopenings', positionController.getMyOpenings);


/* Get position by id */
router.get('/position/:id', positionController.getPositionByID);

router.put('/update/:id',  positionController.updatePosition);
router.get('/apply/:id',  positionController.applyForPosition);


router.get('/position/update/:id', positionController.getPositionByIDToUpdate);


router.get('/create', auth.isUserManager(), function (req, res, next) {
    res.render('position/create', { title: 'Create Position', isUserLoggedIn: true })
})

module.exports = router;
