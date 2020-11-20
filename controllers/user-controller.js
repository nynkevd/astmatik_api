const User = require('../models/user');

const createUser = async (req, res, next) => {
    const {name, email} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email: email});
    } catch (e) {
        return res.status(500).send({message: 'Kan niet aanmelden, probeer het opnieuw.'});
    }

    if (existingUser) {
        return res.status(422).send({message: 'Er bestaat al iemand met dit email-adres'})
    }

    const createdUser = new User({
        firstname: name,
        email: email,
        password: "password",
        asthmaType: "allergisch"
    });

    try {
        await createdUser.save();
    } catch (e) {
        return res.status(500).send({message: 'Kan niet aanmelden, probeer het opnieuw.'});
    }

    return res.status(201).json({message: `Gebruiker ${name} aangemaakt`});
}

exports.createUser = createUser;