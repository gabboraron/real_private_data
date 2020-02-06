'use strict';

class MyWindow{
    constructor(parent) {
        let self = this;
        this.display = true;
        
        let html = theHtmlDownloaderService.getHtml("MyWindow");
        
        this.html            = html.getElementsByTagName("body")[0];
        this.windowMain      = this.html.getElementsByClassName("windowMain")[0];
        this.windowTitleDiv  = this.html.getElementsByClassName("windowTitleDiv")[0];
        this.windowHideSpan  = this.html.getElementsByClassName("windowHideSpan")[0];
        this.windowHideLink  = this.html.getElementsByClassName("windowHideLink")[0];
        this.windowTitleSpan = this.html.getElementsByClassName("windowTitleSpan")[0];
        this.windowBody      = this.html.getElementsByClassName("windowBody")[0];

        this.windowHideLink.addEventListener("click",()=>{this.showHide();return false;});
        parent.appendChild(this.html);
    }

    /**
     * @param {string|HTMLElement} bodyHtml
     * TODO: documented
    */
    setBody(windowBody){
        this.windowBody.innerHTML = "";
        if(typeof(windowBody) === "string"){
            this.windowBody.innerHTML = windowBody;
        }
        else {
            this.windowBody.appendChild(windowBody);
        }
    }

    /**
     * @param {string} title
     * setWindows title 
     */
    setTitle(title){
        this.windowTitleSpan.innerText = title;
    }
    hide() {
        this.windowHideLink.innerText = "[show]";
        this.windowBody.style = "display: none;";
    }
    show() {
        this.windowHideLink.innerText = "[hide]";
        this.windowBody.style = "display: block;";
    }
    showHide(){
        if( this.display ) {
            this.hide();
        } else {
            this.show();
        }
        this.display = !this.display;
    }
}
