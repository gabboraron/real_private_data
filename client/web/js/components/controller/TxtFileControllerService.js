'use strict';
class TxtFileControllerService extends SecretFileControllerService {
    constructor() {
        super();
    }

    start(body, file) {
        this.file = file || theFileFactory.createFile("txt");
        super.start(body, file);
        this.addEventListener( this.htmlItems.txtFileBackLink, "click", this.back);
    }
    
    stop() {
        super.stop();
    }
    
    back(elementName, e, t) {
        this.stop();
        thePageLoader.loadPage("main", undefined, true)
    }

    async save() {
        if(this.isCreate)
            this.createFile();
        else {
            let txt = this.getItem(this.htmlItems.txtPlanInput).value;
            this.file.encrypt(txt);
            try {
                await this.file.upload();
            } catch(e) {
                this.message(e.toString());
                return false;
            }
        }
    }

    async createFile() {
        console.debug("createFile");
        this.setName();
        this.setPassword();
        let txt = this.getItem(this.htmlItems.txtPlanInput).value;
        this.file.encrypt(txt);
        try{
            await this.file.upload(true);
        } catch(e) {
            this.message(e.toString());
            return false;
        }
        this.initFile(this.body);
        this.getItem(this.htmlItems.secretFileMainDiv).style = "display: block;";
        this.getItem(this.htmlItems.fPassLoginForm).style = "display:none;";
     }

     async openFile(elementName, e, t) {
         try {
             await super.openFile(elementName, e, t);
             let decrypted = this.file.decrypt();
             //this.getItem(this.htmlItems.).innerText = decrypted.modifyDate
             this.getItem(this.htmlItems.txtPlanInput).value = decrypted.txt;
         } catch(e) {
             this.message(e)
         }

     }
}

TxtFileControllerService.htmlItems = {
    "txtFileBackLink"     : "txtFileBackLink",
    "filePasswordMainDiv" : "filePasswordMainDiv",
    "fPassSaveButton"     : "fPassSaveButton",
    "txtPlanInput"        : "txtPlanInput",
    "txtEncodedInput"     : "txtEncodedInput"
};