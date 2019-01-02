const express = require('express');
const router = express.Router();

//Route paths are prepended with /auth

router.get('/', (req, res) => {
	res.json({message:'hey'})
});

//Users can login to app with valid email/password
// no blank missing meail
// no blank or incorrect password
function validUser(user) {
	const validEmail = typeof user.email == 'string' && user.email.trim() != '';
	const validPassword = typeof user.password == 'string' && 
				user.password.trim() != '' &&
				user.password.trim().length >= 6;
	return validEmail && validPassword;
}

router.post('/signup', (req, res, next) => {
	if (validUser(req.body)) {
		User
		    .getOneByEmail(req.body.email)
		    .then(user => {
			console.log('user', user);
			res.json({
				user,
				message: 'return'
			});
		    });
	} else  {
		next(new Error('Invalid user'));
	}
});
module.exports = router;
