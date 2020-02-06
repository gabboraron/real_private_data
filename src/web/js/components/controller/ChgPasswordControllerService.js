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
        this.addEventListener( this.htmlItems.chgBackLink, "click", this.back );
        
    }
    
    stop() {
        super.stop();
    }
    
    chgPassword(elementName, e, t) {

    }
    
    back(elementName, e, t) {
        this.stop();
        thePageLoader.loadPage("main", undefined, true);
    }
}