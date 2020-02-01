'use strict';
class TxtFileControllerService extends SecretFileControllerService {
    constructor() {
        super();
    }

    static htmlItems = {
        "txtFileBackLink"     : "txtFileBackLink",
        "filePasswordMainDiv" : "filePasswordMainDiv",
        "fPassSaveButton"     : "fPassSaveButton",
        "txtPlanInput"        : "txtPlanInput",
        "txtEncodedInput"     : "txtEncodedInput"
    };

    start(body, file) {
        this.file = file || FileFactory.createFile("txt");
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
        this.initFile();
     }

     async openFile(elementName, e, t) {
         try {
             await super.openFile(elementName, e, t);
         } catch(e) {
             this.message(e)
         }

     }
}