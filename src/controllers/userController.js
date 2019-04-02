const userQueries = require("../db/queries.users");
const wikiQueries = require("../db/queries.wikis");
const Authorizer = require("../policies/user");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const passport = require("passport");
const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const stripe = require("stripe")(keySecret);
const User = require("../db/models").User;
const Wiki = require("../db/models").Wiki;

module.exports = {
    
    signup(req, res, next){
        res.render("users/signup");
    },

    create(req, res, next){
        let newUser = {
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation
        };

        userQueries.createUser(newUser, (err, user) => {
            if(err){
                req.flash("error", err);
                res.redirect("/users/signup");
            } else {
                passport.authenticate("local")(req, res, () => {
                    req.flash("notice", "You've successfully signed in!");
                    res.redirect("/");
                });

                const msg = {
                    to: user.email,
                    from: 'davidgentile@gmail.com',
                    subject: 'Sign up successful!',
                    text: 'You have successfully signed up to Blocipedia!',
                    html: '<h2>Welcome to Blocipedia!</h2>',
                };
                sgMail.send(msg);
            }
        });
    },

    signInForm(req, res, next){
        res.render("users/sign_in");
    },

    signIn(req, res, next){
        passport.authenticate("local")(req, res, function () {
            if (!req.user) {
                req.flash("notice", "Sign in failed. Please try again.")
                res.redirect("/users/sign_in");
            } else {
                req.flash("notice", "You've successfully signed in!");
                res.redirect("/");
            }
        });
    },

    signOut(req, res, next){
        req.logout();
        req.flash("notice", "You've successfully signed out!");
        res.redirect("/");
    },

    show(req, res, next){
        userQueries.getUser(req.params.id, (err, user) => {
            if(err || user == undefined){
                req.flash("notice", "No user found with that ID.");
                res.redirect("/");
            }
            else {
                const authorized = new Authorizer(req.user, user).new();

                if (authorized) {
                    res.render("users/show", { user, keyPublishable });
                } else {
                    req.flash("notice", "You are not authorized to do that.");
                    res.redirect("/");
                }
            }
        });
    },

    upgrade(req, res, next){
        let amount = 1500;

        stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken
        })
        .then(customer =>
            stripe.charges.create({
                amount,
                description: "Blocipedia Premium Charge",
                currency: "usd",
                customer: customer.id
            })
        )
        .then(charge => {
            if(charge.paid){
                userQueries.upgradeUser(req.user.id, (err, user) => {
                    if (err) {
                        req.flash("error", err);
                        res.redirect(req.headers.referer);
                    } else {
                        req.flash("notice", "You've successfully upgraded!");
                        res.redirect(req.headers.referer);
                    }
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
    },

    downgrade(req, res, next){
        userQueries.downgradeUser(req.user.id, (err, user) => {
            if (err) {
                req.flash("error", err);
                res.redirect(req.headers.referer);
            } else {
                wikiQueries.downgradeWikis(req.user.id, (err, wikis) => {
                    if(err) {
                        req.flash("error", err);
                        res.redirect(req.headers.referer);
                    } else {
                        req.flash("notice", "You've successfully downgraded!");
                        res.redirect(req.headers.referer);
                    }
                });
            }
        });
    },

    wikis(req, res, next){
        userQueries.getUser(req.params.id, (err, user) => {
            if (err || user == undefined) {
                req.flash("notice", "No user found with that ID.");
                res.redirect("/");
            } else {
                const authorized = new Authorizer(req.user, user).new();

                if (authorized) {
                    res.render("users/wikis", { user });
                } else {
                    req.flash("notice", "You are not authorized to do that.");
                    res.redirect("/");
                }
            }
        });
    }

};