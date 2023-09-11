const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const registerLoad = async (req, res) => {
    try {
        res.render('register');
    }
    catch (error) {
        console.log(error);
    }
}

const register = async (req, res) => {
    try {
        const passwordHash = await bcrypt.hash(req.body.password, 10);
        console.log(passwordHash);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            image: 'images/' + req.file.filename,
            password: passwordHash
        });

        await user.save();
        res.render('register', {message: 'User registered successfully'});
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = {registerLoad, register}