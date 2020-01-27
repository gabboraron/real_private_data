'use strict';

async function main(){
    window.theHtmlDownloaderService = new HtmlDownloaderService();
    await theHtmlDownloaderService.start();
    window.theRpcWrapper = new RPCWrapperService();
    window.theUserManager = new UserManagerService();
    theUserManager.start();
    let loggerWindow = new MyWindow(document.getElementById("logDiv"));
    loggerWindow.setTitle("Logging");
    window.theLogger = new Logger(false, theConfig.debug, loggerWindow.windowBody);
    thePageLoader.loadPage("login",undefined, true);
    
}
window.addEventListener("load", () => {
    main().then(() =>{
        console.log("main is finished");
    });
});