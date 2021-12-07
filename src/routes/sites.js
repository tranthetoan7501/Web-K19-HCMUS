const express = require('express');
const router = express.Router();

const sitesController = require('../app/controllers/SitesController');
const passport = require('../config/passport');



router.get('/sign-in',sitesController.in);
router.post('/',passport.authenticate('local',
 { successRedirect: '/',
failureRedirect: '?wrong-password' }
));
router.get('/logout',sitesController.logout);
// router.get('/sign-up',sitesController.up);
// router.post('/sign-up',sitesController.submit);
router.get('/home',sitesController.home);
router.get('/',sitesController.home);


module.exports = router;