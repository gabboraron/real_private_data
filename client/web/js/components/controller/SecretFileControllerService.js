'use strict';
class SecretFileControllerService extends ControllerServiceBase {
    constructor() {
        super();
    }
    

    start(body, file) {
        if(file) {
            this.initFile(body);
        } else {
            this.initCreateFile(body);
        }
        this.addEventListener(this.htmlItems.fPassSaveButton, "click", this.save);
    }
    
    stop() {
        super.stop();
    }
    
    back(elementName, e, t) {
        this.stop();
        thePageLoader.loadPage("main", undefined, true)
    }

    initCreateFile(body) {
        this.isCreate = true;
        let html = theHtmlDownloaderService.getHtml("newFilePassword");
        let filePasswordMainDiv = body.getElementsByClassName("filePasswordMainDiv")[0];
        filePasswordMainDiv.innerHTML = html.getElementsByTagName("body")[0].innerHTML;
        super.start(body);
        this.file.setNameEncryptor( theEncryptor.fromHexString(theUserManager.__dirHash));
    }
    
    
    initFile(body) {
        let self = this;
        this.file.download().then(() => {
            self.downloadRedy = true;
            self.message("File downloaded");
        }).catch((e)=>{
            self.downloadFailed = true;
            self.message(e.toString());
        });
        body = body || this.body;
        this.body = body;
        this.initFilePassword();
        super.start(body);
        if(this.isCreate) {
            this.hideOpenPassword();
        }
        this.getItem(this.htmlItems.secretFileMainDiv).style = "display:none;"
        this.isCreate = false;
        this.getItem(this.htmlItems.fPassNameInput).value = this.file.descryptName();
        this.hideChangePassword();
        this.addEventListener(this.htmlItems.fPassChangePasswordHideLink, "click", this.hideChangePassword);
        this.addEventListener(this.htmlItems.fPassChangePasswordShowLink, "click", this.showChangePassword);
        this.addEventListener(this.htmlItems.fPassLoginForm, "submit", this.openFile);
    }
    
    initFilePassword() {
        let html = theHtmlDownloaderService.getHtml("filePassword");
        let filePasswordMainDiv = this.body.getElementsByClassName("filePasswordMainDiv")[0];
        filePasswordMainDiv.innerHTML = html.getElementsByTagName("body")[0].innerHTML;
    }
    
    hideOpenPassword(){
        this.getItem(this.htmlItems.fPassLoginForm).style = "display:none;";
    }
    
    hideChangePassword() {
        this.getItem(this.htmlItems.fPassChangePasswordForm).style = "display:none;";
        this.getItem(this.htmlItems.fPassChangePasswordShowLink).style = "display:inline;";
        this.getItem(this.htmlItems.fPassChangePasswordHideLink).style = "display:none;";
    }
    
    showChangePassword() {
        this.getItem(this.htmlItems.fPassChangePasswordForm).style = "display:block;";
        this.getItem(this.htmlItems.fPassChangePasswordShowLink).style = "display:none;";
        this.getItem(this.htmlItems.fPassChangePasswordHideLink).style = "display:inline;";
    }
    
    setPassword(onlyCheck = true) {
        let newPassword  = this.getItem(this.htmlItems.fPassNewPasswordInput);
        let newPassword2 = this.getItem(this.htmlItems.fPassNewPassword2Input);
        //let oldPassword = oldPassword = this.getItem(this.htmlItems.fPassOldPasswordInput);

        if(-1 !== [newPassword.value, newPassword2.value].indexOf("")) {
            // TODO: ErrorObject
            let msg = new ErrorObject("Error: password, and/or password again is empty");
            this.message(msg);
            throw msg;
        } else if(newPassword.value != newPassword2.value) {
            // TODO: ErrorObject
            let msg = new ErrorObject("Error: password, and password again is not equal");
            this.message(msg);
            throw msg;
        }
        return this.file.setPassword(newPassword.value);
    }
    
    setName() {
        let nameInput = this.getItem(this.htmlItems.fPassNameInput);
        if("" === nameInput.value){
            // TODO: errorObject
            let msg = "Error, you have to give name to file";
            this.message(msg);
            throw msg;
        }
        nameInput.value = this.file.setName(nameInput.value);
    }
    
    message(msg){
        console.log(msg.toString())
    }
    
     async openFile(elementName, e, t) {
         await this.waitDownload();
         console.debug("after download ready");
         let password  = this.getItem(this.htmlItems.fPassLoginPasswordInput);
         try {
             this.file.setPassword(password.value, true);             
         } catch(e) {
             this.message(e.toString());
             return;
         }
         this.getItem(this.htmlItems.secretFileMainDiv).style = "display: block;";
         this.getItem(this.htmlItems.fPassLoginForm).style = "display:none;";
     }

     async waitDownload() {
        let self = this;
        if(this.downloadRedy) {
            return true;
        } else if(this.downloadFailed) {
            throw new ErrorObject("Download error");
        }
        return new Promise((resolve, reject) => {
            let promiseSelf = this;
            this.i = window.setInterval(()=>{
                console.debug("in interval func");
                if(self.downloadRedy){
                    window.clearInterval(promiseSelf.i);
                    resolve(true);
                } else if(self.downloadFailed) {
                    window.clearInterval(promiseSelf.i);
                    reject(new ErrorObject("Download error"));
                }
            },1000);
        }); 
    }
};

SecretFileControllerService.htmlItems = {
    "fPassChangePasswordShowLink" : "fPassChangePasswordShowLink",
    "fPassTable"                  : "fPassTable",
    "fPassLoginPasswordInput"     : "fPassLoginPasswordInput",
    "fPassFilenameForm"           : "fPassFilenameForm",
    "fPassOpenFileSubmit"         : "fPassOpenFileSubmit",
    "fPassNameInput"              : "fPassNameInput",
    "fPassChangePasswordForm"     : "fPassChangePasswordForm",
    "fPassSaveNameButton"         : "fPassSaveNameButton",
    "fPassNewPasswordInput"       : "fPassNewPasswordInput",
    "fPassOldPasswordTr"          : "fPassOldPasswordTr",
    "fPassNewPassword2Input"      : "fPassNewPassword2Input",
    "fPassLoginForm"              : "fPassLoginForm",
    "fPassChangePasswordHideLink" : "fPassChangePasswordHideLink",
    "fPassOldPasswordInput"       : "fPassOldPasswordInput",
    "fPassChangePasswordTitle"    : "fPassChangePasswordTitle",
    "secretFileMainDiv"           : "secretFileMainDiv"
};