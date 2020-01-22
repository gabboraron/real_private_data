'use strict';

async function main(){
    window.theHtmlDownloaderService = new HtmlDownloaderService();
    await theHtmlDownloaderService.start();
    
    let loggerWindow = new MyWindow(document.getElementById("messageDiv"));
    loggerWindow.setTitle("Logging");
    window.theLogger = new Logger(true, theConfig.debug, loggerWindow.windowBody);
    
    window.lc = new LoginControllerService();
    lc.start();
    //window.x = new MyWindow(document.getElementById("bodyDiv"));
}
window.addEventListener("load", () => {
    main().then(() =>{
        console.log("main is finished");
    });
});