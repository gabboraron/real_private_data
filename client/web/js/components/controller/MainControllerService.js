'use strict';
class MainControllerService extends ControllerServiceBase {
    constructor() {
        super();
    }
    
    htmlItems = {
        "changePasswordLink" : "changePasswordLink",
        "createUserLink"     : "createUserLink",
        "logoutLink"         : "logoutLink"
    }

    start(body) {
        super.start(body);
        this.addEventListener(this.htmlItems.changePasswordLink, "click", this.openPage);
        this.addEventListener(this.htmlItems.createUserLink, "click", this.openPage);
        this.addEventListener(this.htmlItems.logoutLink, "click", this.logout);
    }
    
    stop(){
        console.debug("TODO: Implement...");
        super.stop();
    }
    
    openPage(elementName, e, t){
        e.preventDefault()
        console.debug(elementName);
        return false;
    }
    logout(elementName, e, t) {
        console.debug("TODO: implement");
    }

}