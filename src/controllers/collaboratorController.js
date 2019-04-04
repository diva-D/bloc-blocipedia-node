const collaboratorQueries = require("../db/queries.collaborator");
const Authorizer = require("../policies/collaborator");

module.exports = {
    
    create(req, res, next) {
        const authorized = new Authorizer(req.user).create();

        if (authorized) {

            let newCollaborator = {
                userId: req.params.userId,
                wikiId: req.params.wikiId
            };
            collaboratorQueries.addCollaborator(newCollaborator, (err, collaborator) => {
                if (err) {
                    req.flash("error", "Collaborator NOT added to wiki");
                    res.redirect(500, `/wikis/${collaborator.wikiId}`);
                } else {
                    req.flash("notice", "Collaborator successfully added to wiki!");
                    res.redirect(303, `/wikis/${collaborator.wikiId}/edit`);
                }
            });
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/wikis");
        }
    },

    destroy(req, res, next) {
        collaboratorQueries.deleteCollaborator(req, (err, collaborator) => {
            console.log(err);
            if (err) {
                req.flash("error", "Collaborator NOT removed from wiki");
                res.redirect(err, `/wikis/${req.params.wikiId}`);
            } else {
                req.flash("notice", "Collaborator successfully removed from wiki!");
                res.redirect(303, `/wikis/${req.params.wikiId}/edit`);
            }
        });
    },

};