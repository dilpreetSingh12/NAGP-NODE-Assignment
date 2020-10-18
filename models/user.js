const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const jwtSecret = process.env.JWT_SECRET
const saltRounds = process.env.SALT_ROUNDS || 10;
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: String,
    lastname: String,
    email: String,
    username: String,
    password: String,
    role: String,
});

UserSchema.methods.setHashPassword = async function() {
    const hashPassword = await bcrypt.hash(this.password, saltRounds)
    this.password = hashPassword;
}


UserSchema.methods.validatePassword = async function(password) {
    const pwdMatches = await bcrypt.compare(password, this.password);
    return pwdMatches;
}

UserSchema.methods.generateJwtToken = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 1);

    return jwt.sign({
        _id: this._id,
        username: this.username,
        role: this.role,
        exp: parseInt(expirationDate/1000, 10)
    }, jwtSecret)
}

UserSchema.methods.toAuthJson = function() {
    return {
        username: this.username,
        _id: this._id,
        token: this.generateJwtToken(),
    }
}

UserSchema.methods.userIsManager = function(token) {
    decodedToken = jwt.decode(string)
}


module.exports = mongoose.model('User', UserSchema);
