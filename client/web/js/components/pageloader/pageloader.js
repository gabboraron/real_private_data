'use strict';

class PageLoaderService {
    pagesLocation = {
        "login":"login.html"
    }
    pages = {
        "login":"login"
    }
    constructor(rootLocation){
        this.rootLocation = rootLocation || "/html";
        this.pageTitle    = theConfig.pageTitle || "Real private data";
        this.title        = this.pageTitle;
        this.subTitle     = undefined;
        this.titlePostfix = undefined;
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
    }

    async loadPage(page, toLocation /** =  document.getElementById("bodyDiv") */, modifyTitle /** = false */) {
        toLocation = toLocation || document.getElementById("bodyDiv");
        let self = this;
        return new Promise((resolve, reject) => {
            if( !this.pagesLocation[page] ){
                reject("Page Doesen't found in list: " + page);
                return false;
            }
            let xhttp = new XMLHttpRequest();
            xhttp.onload = function() {
                    let el = document.createElement( 'html' );
                    el.innerHTML = this.responseText;
                    window.d = el;
                    if(modifyTitle) {
                        let title = self.setTitleFromHtml(el);
                        console.debug(title);
                    }
                    self.setBody(el, toLocation);
                    resolve(true);
            };
            xhttp.onerror = () => reject(xhr.statusText);
            let pageLocation = this.rootLocation + "/" + this.pagesLocation[page];
            xhttp.open("GET", pageLocation, true);
            console.debug(pageLocation +" loading...")
            xhttp.send();
        });
    }
};

thePageLoader = new PageLoaderService();