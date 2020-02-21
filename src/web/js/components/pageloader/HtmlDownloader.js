"use strict";

class HtmlDownloaderService {
    htmlFileDict = window.htmlFileDict;

    constructor(rootDir){
        this.rootDir = rootDir || "/html"
        this.htmlDict = {};
    }
    async download(htmlName){
        let self = this;
        return new Promise((resolve, reject) => {
            let xhttp = new XMLHttpRequest();
            xhttp.onload = function() {
                self.htmlDict[htmlName] =  this.responseText;
                resolve(true);
            };
            xhttp.onerror = () => reject(xhr.statusText);
            let path = self.rootDir + "/" + self.htmlFileDict[htmlName];
            console.debug(path + " loading...")
            xhttp.open("GET", path, true);
            xhttp.send();
        });
    }
    async start(){
        let self = this;
        if(this.ready)
            return true;
        let promises = [];
        for(let htmlName in this.htmlFileDict){
            promises.push(this.download(htmlName));
        }
        return Promise.all(promises).then(() => {self.ready = true;});
    }
    
    /**
     * getHtml
     * @param {htmlName} [string]
     * Html name
     * @returns {HTMLElement}
    */
    getHtml(htmlName) {
        let element = document.createElement("html");
        element.innerHTML = this.htmlDict[htmlName];
        return element;
    }

    getBody(htmlName) {
        let html = this.getHtml(htmlName)
        let bodyInnerHTML = html.getElementsByTagName("body")[0].innerHTML
        let ret = document.createElement("div")
        ret.innerHTML = bodyInnerHTML
        return ret
    }
}