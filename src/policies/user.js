const ApplicationPolicy = require("./application");

module.exports = class UserPolicy extends ApplicationPolicy {

    show(){
        return this.record.id == this.user.id;
    }
};