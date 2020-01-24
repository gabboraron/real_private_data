'use strict';

/**
 * @requires theConfig
 * @requires theHtmlDownloaderService
 */
class PageLoaderService {
    pages = {
        "login"       : "login",
        "main"        : "main",
        "chgPassword" : "chgPassword",
        "createUser"  : "createUser",
        "txtFile"     : "txtFile"
    };

    constructor(){
        this.pageTitle    = theConfig.pageTitle || "Real private data";
        this.title        = this.pageTitle;
        this.subTitle     = undefined;
        this.titlePostfix = undefined;

        this.controllers = {
            "login"       : new LoginControllerService(),
            "main"        : new MainControllerService(),
            "chgPassword" : new ChgPasswordControllerService(),
            "createUser"  : new CreateUserControllerService(),
            "txtFile"     : new TxtFileControllerService()
        }
    }

    start() {
        return true;
    }
    
    stop() {
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

        let el = theHtmlDownloaderService.getHtml(page);
        if(modifyTitle) {
            let title = this.setTitleFromHtml(el);
            console.debug(title);
        }
        let body = this.setBody(el, toLocation);
        this.controllers[page].start(body);
        return body;
        
    }
};

window.thePageLoader = new PageLoaderService();