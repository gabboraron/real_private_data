'use strict';
class CreateUserControllerService extends ControllerServiceBase {
    constructor() {
        super();
    }
    
    //TODO: write html elements
    htmlItems = {
        "createUserUsername"  : "createUserUsername",
        "createUserPassword"  : "createUserPassword",
        "createUserPassword2" : "createUserPassword2",
        "createUserButton"    : "createUserButton",
        "loginMessage"        : "loginMessage",
        "createUserForm"      : "createUserForm",
        "createUserBackLink"  : "createUserBackLink"
    }

    start(body) {
        super.start(body);
        this.addEventListener( this.htmlItems.createUserForm, "submit", this.createUser);
        this.addEventListener( this.htmlItems.createUserBackLink, "click", this.back);
    }
    
    stop() {
        super.stop();
    }
    
    createUser(elementName, e, t) {
        e.preventDefault();

    }
    back(elementName, e, t) {
        this.stop();
        e.preventDefault();
        thePageLoader.loadPage("main", undefined, true)
    }

}