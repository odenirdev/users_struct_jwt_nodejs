const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

module.exports = (req, res, next) => {
    const autHeader = req.headers.authorization;

    if (!autHeader)
        return res.status(401).send({error: 'No token authorization'});

    const parts = autHeader.split(' ');

    if (!parts.length === 2)
        return res.status(401).send({error: 'Token error'});

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({error: 'Token malformatted'});

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) return res.status(401).send({error: 'Token Invalid'});

        req.userId = decoded.id;
        return next();
    });
}