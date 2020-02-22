'use strict';
class ChgPasswordControllerService extends ControllerServiceBase {
    constructor() {
        super();
    }
    
    htmlItems = {
        "chgOldPassword"  : "chgOldPassword",
        "chgNewPassword"  : "chgNewPassword",
        "chgNewPassword2" : "chgNewPassword2",
        "chgButton"       : "chgButton",
        "chgMessage"      : "chgMessage",
        "chgForm"         : "chgForm",
        "chgBackLink"     : "chgBackLink"
    }

    start(body) {
        super.start(body);
        this.addEventListener( this.htmlItems.chgForm, "submit", this.chgPassword );
        this.addEventListener( this.htmlItems.chgBackLink, "click", this.backToMain );
        
    }
    
    stop() {
        super.stop();
    }
    
    resetForm() {
        this.getItem(this.htmlItems.chgOldPassword).value = ""
        this.getItem(this.htmlItems.chgNewPassword).value = ""
        this.getItem(this.htmlItems.chgNewPassword2).value = ""
    }
    async chgPassword(elementName, e, t) {
        let oldPassword = this.getItem(this.htmlItems.chgOldPassword).value
        let newPassword1 = this.getItem(this.htmlItems.chgNewPassword).value
        let newPassword2 = this.getItem(this.htmlItems.chgNewPassword2).value
        
        try {
            await theUserManager.chgPassword(oldPassword, newPassword1)
            thePageLoader.logout("Password has been changed")
        } catch(e) {
            this.error(e)
        }
    }
}