'use strict';

class MainControllerService extends ControllerServiceBase {
    constructor() {
        super();
    }
    
    //TODO: write html elements
    htmlItems = {
        "htmlElement":"htmlElement"
    }

    start(body) {
        super.start(body);
        //this.addEventListener( this.htmlItems.loginButton, "click", this.login);

        console.debug("TODO: Implement...");
    }
    
    stop(){
        console.debug("TODO: Implement...");
        super.stop();
    }

}