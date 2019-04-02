const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Authorizer = require("../policies/wiki");

module.exports = {

    getAllWikis(callback){
        return Wiki.all()

        .then((wikis) => {
            callback(null, wikis);
        })
        .catch((err) => {
            callback(err);
        });
    },

    getWiki(id, callback){
        return Wiki.findById(id, {
            include: [
                {model: User}
            ]
        })
        .then((wiki) => {
            callback(null, wiki);
        })
        .catch((err) => {
            callback(err);
        });
    },

    addWiki(newWiki, callback) {
        return Wiki.create(newWiki)
        .then((wiki) => {
            callback(null, wiki);
        })
        .catch((err) => {
            callback(err);
        });
    },

    updateWiki(req, updatedWiki, callback) {
        return Wiki.findById(req.params.id)
        .then((wiki) => {
            if (!wiki) {
                return callback("Wiki not found");
            }

            const authorized = new Authorizer(req.user, wiki).update();

            if (authorized) {
                console.log(updatedWiki);
                wiki.update(updatedWiki, {
                        fields: Object.keys(updatedWiki)
                    })
                    .then(() => {
                        callback(null, wiki);
                    })
                    .catch((err) => {
                        callback(err);
                    });
            } else {
                req.flash("notice", "You are not authorized to dot that.");
                callback("Forbidden");
            }
        });
    },

    deleteWiki(req, callback){
        return Wiki.findById(req.params.id)
        .then((wiki) => {
            const authorized = new Authorizer(req.user, wiki).destroy();

            if(authorized){
                wiki.destroy()
                .then((res) => {
                    callback(null, wiki);
                });
            } else {
                req.flash("notice", "You are not authorized to do that.");
                callback(401);
            }
        })
        .catch((err) => {
            callback(err);
        });
    },

    downgradeWikis(userId, callback){
        Wiki.update( { private: false }, { where: {userId: userId } })
        .then((wikis) => {
            callback(null, wikis);
        })
        .catch((err) => {
            callback(err);
        });
    },
};