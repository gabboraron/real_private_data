'use strict';

async function main(){
    if(theConfig.debug) {
        document.body.classList.add("debugBody");
    }
    window.theHash = new SHA256Salty(theConfig.salt);
    window.theEncryptor = AESEncryptor;
    window.theHtmlDownloaderService = new HtmlDownloaderService();
    window.theFileFactory = new FileFactory();
    window.theDirManager = new DirManagerService();
    await theHtmlDownloaderService.start();
    window.theRpcWrapper = new RPCWrapperService();
    window.theUserManager = new UserManagerService();
    theUserManager.start();
    window.thePageLoader = new PageLoaderService();
    thePageLoader.loadPage("login", undefined, true);
    //TODO: DELETE NEXT 3 lines, and discomment pervious line
    //await theUserManager.login("u", "p", "SimpleJsonRpcWebSocketClientService");
    //thePageLoader.login("u");
    //thePageLoader.loadPage("main", undefined, true);

}
window.addEventListener("load", () => {
    main().then(() =>{
        console.log("main is finished");
    });
});