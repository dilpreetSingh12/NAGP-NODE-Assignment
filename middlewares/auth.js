const expressJwt = require('express-jwt')

const PREFIX = 'Bearer ';
const jwt = require('jsonwebtoken');

function isAuthenticated() {
    return expressJwt({
        secret: process.env.JWT_SECRET,
        algorithms: ["HS256"],
        getToken: function (req) {
            if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                return req.headers.authorization.split(' ')[1];
            } else if (req.cookies.auth && req.cookies.auth !== '') {
                req.headers.authorization = 'Bearer ' + req.cookies.auth
                return req.cookies.auth
            }
            return null
        },

    })
}

function isUserManager() {
    return (req, res, next) => {
        var token = req.headers['authorization']
        if (token.startsWith(PREFIX)) {
            token = token.replace(PREFIX, '')
        } else {
            res.status(400).send('Token is not valid')
        }
        const decodedToken = jwt.decode(token, { json: true })
        const role = decodedToken['role'].toLowerCase()
        if (role === "manager") {
            next()
        } else {
            res.status(401).send('User is not authorized')
        }
    }
}

function getUserID(req, res, next) {
    var token = req.headers['authorization']
    if (token.startsWith(PREFIX)) {
        token = token.replace(PREFIX, '')
    } else {
        res.status(400).send('Token is not valid')
    }
    const decodedToken = jwt.decode(token, { json: true })
    return decodedToken['_id']
}

function getUserRole(req, res, next) {
    var token = req.headers['authorization']
    if (token.startsWith(PREFIX)) {
        token = token.replace(PREFIX, '')
    } else {
        res.status(400).send('Token is not valid')
    }
    const decodedToken = jwt.decode(token, { json: true })
    return decodedToken['role']
}

module.exports = {
    isAuthenticated,
    isUserManager,
    getUserID,
    getUserRole,
}
