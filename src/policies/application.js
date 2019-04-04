module.exports = class ApplicationPolicy {
    constructor(user, record) {
        this.user = user;
        this.record = record;
    }

    _isOwner() {
        return this.record && (this.record.userId == this.user.id);
    }

    _isAdmin() {
        return this.user && this.user.role == "2";
    }

    _isMember() {
        return this.user && this.user.role == "0";
    }
    
    _isPremium() {
        return this.user && this.user.role == "1";
    }

    _isCollaborator() {
        let userIsCollab = this.record.collaborators.filter(collab => collab.userId == this.user.id).length > 0;
        return this.user && userIsCollab;
    }

    new() {
        return this.user != null;
    }

    create() {
        return this.new();
    }

    show() {
        return true;
    }

    edit() {
        return this.new() &&
            this.record && (this._isOwner() || this._isAdmin() || this._isCollaborator);
    }

    update() {
        return this.edit();
    }

    destroy() {
        return this.update();
    }
};