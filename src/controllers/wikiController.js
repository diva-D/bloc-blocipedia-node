const wikiQueries = require("../db/queries.wikis");
const Authorizer = require("../policies/wiki");
const markdown = require("markdown").markdown;
const TurndownService = require('turndown');

module.exports = {
    index(req, res, next) {
        wikiQueries.getAllWikis((err, wikis) => {
            if (err) {
                res.redirect(500, "static/index");
            } else {
                res.render("wikis/index", { wikis });
            }
        });
    },

    public(req, res, next) {
        wikiQueries.getAllWikis((err, wikis) => {
            if (err) {
                res.redirect(500, "static/index");
            } else {
                res.render("wikis/public", {
                    wikis
                });
            }
        });
    },

    new(req, res, next) {
        const authorized = new Authorizer(req.user).new();
        if (authorized) {
            res.render("wikis/new");
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/wikis");
        }
    },

    create(req, res, next) {
        const authorized = new Authorizer(req.user).create();

        if (authorized) {
            let wikiMarkdown = markdown.toHTML(req.body.body);
            
            let newWiki = {
                title: req.body.title,
                body: wikiMarkdown,
                userId: req.user.id,
                private: req.body.private
            };
            wikiQueries.addWiki(newWiki, (err, wiki) => {
                if (err) {
                    res.redirect(500, "/wikis/new");
                } else {
                    res.redirect(303, `/wikis/${wiki.id}`);
                }
            });
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/wikis");
        }
    },

    show(req, res, next) {
        wikiQueries.getWiki(req.params.id, (err, result) => {
            if (err || result == null) {
                res.redirect(404, "/");
            } else {
                res.render("wikis/show", {...result});
            }
        });
    },

    destroy(req, res, next) {
        wikiQueries.deleteWiki(req, (err, wiki) => {
            if (err) {
                res.redirect(err, `/wikis/${req.params.id}`);
            } else {
                res.redirect(303, "/wikis");
            }
        });
    },

    edit(req, res, next) {
        wikiQueries.getWiki(req.params.id, (err, result) => {
            if (err || result == null) {
                res.redirect(404, "/");
            } else {
                const authorized = new Authorizer(req.user, result.wiki).edit();

                if (authorized) {
                    let turndownService = new TurndownService();
                    let markdown = turndownService.turndown(result.wiki.body);
                    result.wiki.body = markdown;
                    
                    res.render("wikis/edit", {...result});
                } else {
                    req.flash("notice", "You are not authorized to do that.");
                    res.redirect(`/wikis/${req.params.id}`);
                }
            }
        });
    },

    update(req, res, next) {
        let wikiMarkdown = markdown.toHTML(req.body.body);
        req.body.body = wikiMarkdown;        

        wikiQueries.updateWiki(req, req.body, (err, wiki) => {
            if (err || wiki == null) {
                res.redirect(404, `wikis/${req.params.id}/edit`);
            } else {
                res.redirect(`/wikis/${req.params.id}`);
            }
        });
    },

    private(req, res, next){
        wikiQueries.updateWiki(req, req.body, (err, wiki) => {
            if (err || wiki == null) {
                req.flash("error", "Wiki status not changed");
                res.redirect(req.headers.referer);
            } else {
                req.flash("notice", `${wiki.title}'s status successfully updated to ${wiki.private ? "private" : "public"}`);
                res.redirect(req.headers.referer);
            }
        });
    },
};