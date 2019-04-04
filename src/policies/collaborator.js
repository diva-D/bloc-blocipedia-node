const ApplicationPolicy = require("./application");

module.exports = class CollaboratorPolicy extends ApplicationPolicy {

    _isCollaborator() {
        return this.user && this.user.collaborator;
    }

    create(){
        return this.new() &&
            (this._isPremium() || this._isAdmin() || this._isCollaborator());
    }

    destroy(){
        return this.new() &&
            (this._isPremium() || this._isAdmin())
    }
};