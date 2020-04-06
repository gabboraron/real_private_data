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
        "createUserMessage"   : "createUserMessage",
        "createUserForm"      : "createUserForm",
        "createUserBackLink"  : "createUserBackLink"
    }

    start(body) {
        super.start(body);
        this.addEventListener( this.htmlItems.createUserForm, "submit", this.createUser);
        this.addEventListener( this.htmlItems.createUserBackLink, "click", this.backToMain);
    }
    
    stop() {
        super.stop();
    }
    
    async createUser(elementName, e, t) {
        let username =  this.getItem(this.htmlItems.createUserUsername).value;
        let password =  this.getItem(this.htmlItems.createUserPassword).value;
        let password2 = this.getItem(this.htmlItems.createUserPassword2).value;

        if([username, password, password2].indexOf("") !== -1) {
            let err = new ErrorObject(ErrorTypeEnum.EMPTY_USERNAME_PASSWORD);
            this.error(err);
            return;
        }
        if(password !== password2) {
            let err = new ErrorObject(ErrorTypeEnum.PASSWORD_NOT_EQUAL_PASSWORD2);
            this.error(err);
            this.getItem(this.htmlItems.createUserPassword).value = "";
            this.getItem(this.htmlItems.createUserPassword2).value = "";
            return;
        }

        try {
            await theUserManager.createUser(username, password);
            this.message("User created.");
        } catch(e){
            this.error(e.toString());
        }
        this.getItem(this.htmlItems.createUserForm).reset();
    }
}