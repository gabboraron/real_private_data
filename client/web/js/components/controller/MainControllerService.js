'use strict';
class MainControllerService extends ControllerServiceBase {
    constructor() {
        super();
    }
    
    htmlItems = {
        "changePasswordLink" : "changePasswordLink",
        "createUserLink"     : "createUserLink",
        "createFileLink"     : "createFileLink"
    }

    start(body) {
        super.start(body);
        this.addEventListener(this.htmlItems.changePasswordLink, "click", this.openPage);
        this.addEventListener(this.htmlItems.createUserLink, "click", this.openPage);
        this.addEventListener(this.htmlItems.createFileLink, "click", this.openPage);
    }
    
    stop(){
        console.debug("TODO: Implement...");
        super.stop();
    }
    
    openPage(elementName, e, t){
        switch(elementName){
            case this.htmlItems.createUserLink:
                this.stop();
                thePageLoader.loadPage("createUser", undefined, true);
                break;
            case this.htmlItems.changePasswordLink:
                this.stop();
                thePageLoader.loadPage("chgPassword", undefined, true);
                break;
            case this.htmlItems.createFileLink:
                this.stop();
                thePageLoader.loadPage("txtFile", undefined, true);
                break;
        }
    }
    logout(elementName, e, t) {
        console.debug("TODO: implement");
    }

}