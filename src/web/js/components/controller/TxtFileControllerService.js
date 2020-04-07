'use strict';
class TxtFileControllerService extends SecretFileControllerService {
    constructor() {
        super();
    }

    start(body, file) {
        this.file = file || theFileFactory.createFile("txt");
        super.start(body, file);
        if(theConfig.show_encrypted_data){
            this.addEventListener("txtPlanInput", "keyup", this.showEncryptedData)
        }
    }
    
    stop() {
        super.stop();
    }

    async save() {
        if(this.isCreate)
            this.createFile();
        else {
            let txt = this.getItem(this.htmlItems.txtPlanInput).value;
            this.file.encrypt(txt);
            try {
                await this.file.upload();
                this.message("File has been saved succesfully")
            } catch(e) {
                this.error(e.toString());
                return false;
            }
        }
    }

    async createFile() {
        console.debug("createFile");
        this.setName();
        let txt = this.getItem(this.htmlItems.txtPlanInput).value;
        this.file.encrypt(txt);
        try{
            await this.file.upload(true);
        } catch(e) {
            this.error(e.toString());
            return false;
        }
        this.initFile(this.body, "File has been saved succesfully")
        this.showMainDiv()
        this.hideChangePassword()
    }

    async openFile(elementName, e, t) {
        try {
            await super.openFile(elementName, e, t);
            let decrypted = this.file.decrypt();
            //this.getItem(this.htmlItems.).innerText = decrypted.modifyDate
            this.getItem(this.htmlItems.txtPlanInput).value = decrypted.txt;
            if(theConfig.show_encrypted_data) {
                this.showEncryptedData()
            }
        } catch(e) {
            this.error(e)
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