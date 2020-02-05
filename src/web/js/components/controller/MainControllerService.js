'use strict';
class MainControllerService extends ControllerServiceBase {
    constructor() {
        super();
    }
    
    htmlItems = {
        "changePasswordLink" : "changePasswordLink",
        "createUserLink"     : "createUserLink",
        "createFileLink"     : "createFileLink"
    }

    start(body) {
        super.start(body);
        this.addEventListener(this.htmlItems.changePasswordLink, "click", this.openPage);
        this.addEventListener(this.htmlItems.createUserLink, "click", this.openPage);
        this.addEventListener(this.htmlItems.createFileLink, "click", this.openPage);
        this.listFiles(true);
    }
    
    stop(){
        console.debug("TODO: Implement...");
        super.stop();
    }
    
    openPage(elementName, e, t){
        switch(elementName){
            case this.htmlItems.createUserLink:
                this.stop();
                thePageLoader.loadPage("createUser", undefined, true);
                break;
            case this.htmlItems.changePasswordLink:
                this.stop();
                thePageLoader.loadPage("chgPassword", undefined, true);
                break;
            case this.htmlItems.createFileLink:
                this.stop();
                thePageLoader.loadPage("txtFile", undefined, true);
                break;
        }
    }

    async listFiles(refresh = false) {
        let files = await theDirManager.showFiles(refresh);
        let mainTable = this.getItem("mainFilesTable");
        for(let i = 0; i < files.length; ++i) {
            let tr = this.createFileTr( files[i])
            mainTable.appendChild(tr);
        }
        
    }

    createFileTr(f){
        let self = this;
        let tr = document.createElement("tr");
        
        let link = document.createElement("a");
        link.innerText = f.decryptedName;
        link.class = "mainOpenFile";
        link.href = "#";
        link.addEventListener("click", (e) =>{
            e.preventDefault();
            self.openFile(f.encryptedName);
        });
        
        let linkTd = document.createElement("td");
        linkTd.appendChild(link);
        tr.appendChild(linkTd);

        let typeTd = document.createElement("td");
        typeTd.innerText = f.decryptedName.match(/[.]([^.]+)$/)[1];
        tr.appendChild(typeTd);
        return tr;
    }

    openFile(encryptedName) {
        let f = theDirManager.openFile(encryptedName);
        thePageLoader.loadPage("txtFile",undefined, true, f);
    }
}