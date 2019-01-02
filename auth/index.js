const express = require('express');
const router = express.Router();

//Route paths are prepended with /auth

router.get('/', (req, res) => {
	res.json({message:'hey'})
});

router.post('/signup', (req, res) => {
	res.json({
		message: 'return'
	});
});
module.exports = router;
