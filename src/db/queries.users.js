const User = require("./models").User;
const Wiki = require("./models").Wiki;
const Collaborator = require("./models").Collaborator;
const bcrypt = require("bcryptjs");

module.exports = {
    createUser(newUser, callback) {

        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newUser.password, salt);

        return User.create({
            email: newUser.email,
            password: hashedPassword
        })
        .then((user) => {
            callback(null, user);
        })
        .catch((err) => {
            callback(err);
        });
    },

    getUser(id, callback){
        User.findById(id, {
            include: [{
                model: Wiki,
                as: "wikis"
            }],
            order: [
                [{model: Wiki, as: "wikis"}, "createdAt", "DESC"]
            ]
        })
        .then((user) => {
            if (!user) {
                callback(404);
            } else {
                callback(null, user);
            }
        })
        .catch((err) => {
            callback(err);
        });
    },

    upgradeUser(id, callback){
        User.update( { role: 1 }, { where: {id: id } })
        .then((user) => {
            callback(null, user);
        })
        .catch((err) => {
            callback(err);
        });
    },

    downgradeUser(id, callback){
        User.update( { role: 0 }, { where: {id: id } })
        .then((user) => {
            callback(null, user);
        })
        .catch((err) => {
            callback(err);
        });
    },

};