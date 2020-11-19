const User = require('../models/user');

const createUser = async (req, res, next) => {
    const {name} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({name: name});
    } catch (e) {
        return res.status(500).send({message: 'Kan niet aanmelden, probeer het opnieuw.'});
    }

    if (existingUser) {
        return res.status(422).send({message: 'Er bestaat al iemand met deze naam'})
    }

    const createdUser = new User({
        name
    });

    try {
        await createdUser.save();
    } catch (e) {
        return res.status(500).send({message: 'Kan niet aanmelden, probeer het opnieuw.'});
    }

    return res.status(201).json({message: `Gebruiker ${name} aangemaakt`});
}

exports.createUser = createUser;