'use strict';
class TxtFileControllerService extends ControllerServiceBase {
    constructor() {
        super();
    }
    
    htmlItems = {
        "txtFileBackLink" : "txtFileBackLink"
    }

    start(body) {
        super.start(body);
        this.addEventListener( this.htmlItems.txtFileBackLink, "click", this.back);
    }
    
    stop() {
        super.stop();
    }
    
    back(elementName, e, t) {
        this.stop();
        thePageLoader.loadPage("main", undefined, true)
    }
}