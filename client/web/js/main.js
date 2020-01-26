'use strict';

async function main(){
    window.theHtmlDownloaderService = new HtmlDownloaderService();
    await theHtmlDownloaderService.start();
    window.theUserManager = new UserManagerService();
    theUserManager.start();
    let loggerWindow = new MyWindow(document.getElementById("logDiv"));
    loggerWindow.setTitle("Logging");
    window.theLogger = new Logger(true, theConfig.debug, loggerWindow.windowBody);
    thePageLoader.loadPage("login",undefined, true);
    
    //window.x = new MyWindow(document.getElementById("bodyDiv"));
}
window.addEventListener("load", () => {
    main().then(() =>{
        console.log("main is finished");
    });
});