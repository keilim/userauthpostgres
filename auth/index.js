const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../db/user');
//Route paths are prepended with /auth

router.get('/', (req, res) => {
	res.json({message:'hey'})
});

//Users can login to app with valid email/password
// no blank missing meail
// no blank or incorrect password
function validUser(user) {
	console.log(user.email);
	const validEmail = typeof user.email == 'string' && user.email.trim() != '';
	const validPassword = typeof user.password == 'string' && 
				user.password.trim() != '' &&
				user.password.trim().length >= 6;
	console.log(validEmail);
	console.log(validPassword);
	return validEmail && validPassword;
}

router.post('/signup', (req, res, next) => {
	if (validUser(req.body)) {
		User
		    .getOneByEmail(req.body.email)
		    .then(user => {
				console.log('user', user);
				//if user not found
				if (!user) {
					//this is a unique email
					//hash password
					bcrypt.hash(req.body.password, 10)
						.then((hash) => {
							//store hash in your password
							//insert user into db
							const user = {
								email: req.body.email,
								password: hash,
								created_at: new Date()
							};

							User
								.create(user)
								.then(id => {
									//redirect
									res.json({
										id,
										message: 'return'
									});
								})
						});

				} else {
					//email in use
					next(new Error('Email in use'));
				}
		    });
	} else  {
		next(new Error('Invalid user'));
	}
});

router.post('/login', (req, res, next) => {
	if (validUser(req.body)) {
		// check to see if in DB
		User
			.getOneByEmail(req.body.email)
			.then(user => {
				console.log('user', user);
				if (user) {
					//compare password with hashed password
					bcrypt
						.compare(req.body.password, user.password)
						.then((result) => {
							// if the password matched
							if (result) {
								//makes it true when it is in development;
								const isSecure = req.app.get('env') != 'development'; 
								// setting the set-cookie' header
								// also making it a secure cookie.
								res.cookie('user_id', user.id, {
									httpOnly: true,
									secure: isSecure,
									// signed hashes it
									signed: true
								});
								res.json({
									message: 'Logged in...'
								});
							} else {
								next(new Error('Invalid Login'));
							}
						});
				} else {
					next(new Error('Invalid Login'));
				}
			});
	} else  {
		next(new Error('Invalid Login'));
	}
})

module.exports = router;
