const userQueries = require("../db/queries.users");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const passport = require("passport");

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
                req.flash("notice", "You've successfully signed in!");
                res.redirect("/");
                const msg = {
                    to: user.email,
                    from: 'davidgentile@gmail.com',
                    subject: 'Sign up successful!',
                    text: 'You have successfully signed up to Blocipedia!',
                    html: '<h2>Welcome to Blocipedia!</h2>',
                };
                sgMail.send(msg);

            // passport.authenticate("local")(req, res, () => {
            //  req.flash("notice", "You've successfully signed in!");
            //  res.redirect("/");
            // });
        }
     });
   }

};