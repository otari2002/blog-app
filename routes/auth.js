const express = require('express');
const router = express.Router();
const passport = require('passport');
 
router.post('/login', passport.authenticate('local'), (req, res) => {
	res.sendStatus(200);
});

router.get('/login', (req, res) => {
	if (req.isAuthenticated()) {
	  res.status(200).json(req.user);
	} else {
	  res.status(200).json(null);
	}
});

router.post('/logout', function(req, res) {
	req.logout((err) => {
		if (err) {
		  console.error('Error login out :', err);
		}
		res.redirect('/');
	});
});
module.exports = router;