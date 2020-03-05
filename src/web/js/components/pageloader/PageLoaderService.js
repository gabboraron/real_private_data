'use strict';

/**
 * @requires theConfig
 * @requires theHtmlDownloaderService
 */
class PageLoaderService {
    pages = {
        "login"         : "login",
        "main"          : "main",
        "chgPassword"   : "chgPassword",
        "createUser"    : "createUser",
        "txtFile"       : "txtFile",
        "phoneBookFile" : "phoneBookFile"
    };

    constructor(){
        this.pageTitle    = theConfig.pageTitle || "Real private data";
        this.title        = this.pageTitle;
        this.subTitle     = undefined;
        this.titlePostfix = undefined;
        this.userName     = undefined;
        this.logedIn      = false;
        this.currentPage  = undefined;

        this.controllers = {
            "login"         : new LoginControllerService(),
            "main"          : new MainControllerService(),
            "chgPassword"   : new ChgPasswordControllerService(),
            "createUser"    : new CreateUserControllerService(),
            "txtFile"       : new TxtFileControllerService(),
            "phoneBookFile" : new PhoneBookFileControllerService()
        }
    }

    start() {
        return true;
    }
    
    stop() {
        this.logout();
        return true;
    }
    
    getTitle(){
        return this.title;
    }
    applyTitle() {
        let title = this.pageTitle;
        if(this.subTitle) {
            title += " - " + this.subTitle;
        }
        if(this.titlePostfix) {
            title += " : " + this.titlePostfix;
        }
        this.title = title;
        document.title = title;
        document.getElementById("titleH1").innerText = title;
        return title;
    }

    setSubTitle(subTitle, apply /* = true */ ){
        this.subTitle = subTitle;
        if(typeof(apply) === "undefined" || apply ) {
            this.applyTitle();
        }
        return this.title;
    }

    setTitlePostfix(titlePostfix){
        this.titlePostfix = titlePostfix;
        if(typeof(apply) === "undefined" || apply ) {
            this.applyTitle();
        }
        return this.title;
    }

    setTitleFromHtml(el)
    {
        let titleTags = el.getElementsByTagName("title");
        if(0 !== titleTags.length) {
            this.setSubTitle(titleTags[0].innerText, false);
        }
        this.setTitlePostfix();
    }

    setBody(el, toLocation){

        let body = "";
        let bodyTags = el.getElementsByTagName("body");
        if(0 !== bodyTags.length) {
            body = bodyTags[0].innerHTML;
        }
        toLocation.innerHTML = body;
        return toLocation;
    }

    loadPage(page, toLocation /** =  document.getElementById("bodyDiv") */, modifyTitle /** = false */) {
        toLocation = toLocation || document.getElementById("bodyDiv");

        if(this.currentPage)
            this.currentPage.stop();
        let el = theHtmlDownloaderService.getHtml(page);
        if(modifyTitle) {
            let title = this.setTitleFromHtml(el);
            console.debug(title);
        }
        let body = this.setBody(el, toLocation);
        this.currentPage = this.controllers[page];
        let remainingArgs = [];
        for(let i = 3; i < arguments.length; ++i) {
            remainingArgs.push(arguments[i]);
        }
        this.currentPage.start(body, ...remainingArgs);
        return body;
    }

    login(userName) {
        this.startLogout = false
        let self = this
        this.userName = userName;
        this.logedIn = true;

        theRpcClient.addEventListener("close", (e) => { self.handleClose(e) })
    }

    handleClose(e) {
        if(!this.startLogout) {
            this.logout(new ErrorObject("Suddenly loged out"), "error")
        }
    }
    async logout(msg = "Logout was successful", ty = "msg") {
        this.startLogout = true
        await theUserManager.logout();
        this.userName = undefined;
        this.logedIn = false;
        this.loadPage("login", undefined, true, msg, ty);
    }

    __logoutSetStyle(style){
        let logoutLinks = document.getElementsByClassName("logoutLink");
        for(let i = 0; i < logoutLinks.length; ++i){
            logoutLinks[i].style = style;
        }
    }
    __logoutSetEventListener(){
        let self = this;
        if(this.__logoutSetEventListenerRun)
           return;
        this.__logoutSetEventListenerRun = true;
        let logoutLinks = document.getElementsByClassName("logoutLink");
        for(let i = 0; i < logoutLinks.length; ++i) {
            logoutLinks[i].addEventListener("click", (e)=>{self.logout(e);} );
        }
    }
};