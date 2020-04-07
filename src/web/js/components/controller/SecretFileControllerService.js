'use strict';
class SecretFileControllerService extends ControllerServiceBase {
    constructor() {
        super();
    }
    

    start(body, file) {
        body = body || this.body;
        this.body = body;
        if(file) {
            this.initFile(body);
        } else {
            this.initCreateFile(body);
        }
        this.addEventListener(this.htmlItems.fPassSaveButton, "click", this.save);
        this.addEventListener("fPassNewPasswordForm", "submit", this.setPassword)
        this.addEventListener(this.htmlItems.fPassChangePasswordForm, "submit", this.chgPassword)
        this.hideMainDiv()
    }
    
    stop() {
        remove(this, "file")
        super.stop();
    }
    
    initCreateFile(body) {
        this.isCreate = true;
        this.initFilePasswordDiv("newFilePassword");
        super.start(body);
        this.file.setNameEncryptor( theEncryptor.fromHexString(theUserManager.__dirHash));
    }
    
    
    initFile(body, downloadMsg = "File downloaded") {
        let self = this;
        this.file.download().then(() => {
            self.downloadRedy = true;
            self.message(downloadMsg);
        }).catch((e)=>{
            self.downloadFailed = true;
            self.message(e.toString());
        });
        this.initFilePasswordDiv("filePassword");
        super.start(body);
        if(this.isCreate) {
            this.hideOpenPassword();
        }
        this.hideElement(this.htmlItems.secretFileMainDiv)
        this.isCreate = false;
        thePageLoader.setTitlePostfix(this.file.decryptName())
        this.hideChangePassword();
        this.addEventListener(this.htmlItems.fPassChangePasswordHideLink, "click", this.hideChangePassword);
        this.addEventListener(this.htmlItems.fPassChangePasswordShowLink, "click", this.showChangePassword);
        this.addEventListener(this.htmlItems.fPassLoginForm, "submit", this.openFile);
    }
    
    initFilePasswordDiv(htmlName) {
        let html = theHtmlDownloaderService.getBody(htmlName);
        let filePasswordMainDiv = this.body.getElementsByClassName("filePasswordMainDiv")[0];
        filePasswordMainDiv.innerHTML = html.innerHTML;
    }
    
    hideOpenPassword(){
        this.hideElement(this.htmlItems.fPassLoginForm);
    }
    
    hideChangePassword() {
        this.hideElement(this.htmlItems.fPassChangePasswordForm)
    }
    
    showMainDiv() {
        this.showElement(this.htmlItems.secretFileMainDiv)
        this.showElement("fPassChangePasswordShowNavItem")
        this.showElement("phbShowAddContactNavItem")
        this.showElement("fPassSaveNavItem")
        if(theConfig.show_encrypted_data) {
            this.showElement("encodedDiv")
        }
    }
    
    hideMainDiv() {
        this.hideElement(this.htmlItems.secretFileMainDiv);
    }
    
    showChangePassword() {
        this.showElement(this.htmlItems.fPassChangePasswordForm)
    }
    
    setPassword() {
        let newPassword  = this.getItem(this.htmlItems.fPassNewPasswordInput);
        let newPassword2 = this.getItem(this.htmlItems.fPassNewPassword2Input);
        //let oldPassword = oldPassword = this.getItem(this.htmlItems.fPassOldPasswordInput);

        if(-1 !== [newPassword.value, newPassword2.value].indexOf("")) {
            let err = new ErrorObject(ErrorTypeEnum.PASWORD_PASSWORD2_EMPTY);
            this.error(err);
            throw err;
        } else if(newPassword.value != newPassword2.value) {
            let err = new ErrorObject(ErrorTypeEnum.PASSWORD_NOT_EQUAL_PASSWORD2);
            this.error(err);
            throw err;
        }
        let ret = this.file.setPassword(newPassword.value);
        this.file.clear()
        this.showMainDiv()
        return ret
    }
    
    setName() {
        let nameInput = this.getItem(this.htmlItems.fPassNameInput);
        if("" === nameInput.value){
            let err = new ErrorObject(ErrorTypeEnum.EMPTY_FILE_FIELD);
            this.error(err);
            throw err;
        }
        nameInput.value = this.file.setName(nameInput.value);
    }
    
    async openFile(elementName, e, t) {
        await this.waitDownload();
        console.debug("after download ready");
        let password  = this.getItem(this.htmlItems.fPassLoginPasswordInput);
        try {
            this.file.setPassword(password.value, true);
            this.message("File opened")             
        } catch(e) {
            this.error(e.toString());
            throw e
        }
        this.showMainDiv()
        this.getItem(this.htmlItems.fPassLoginForm).style = "display:none;";
    }

    async chgPassword(elementName, e, t) {
        let newPassword  = this.getItem(this.htmlItems.fPassNewPasswordInput);
        let newPassword2 = this.getItem(this.htmlItems.fPassNewPassword2Input);
        let oldPassword = this.getItem(this.htmlItems.fPassOldPasswordInput);

        if(-1 !== [newPassword.value, newPassword2.value, oldPassword.value].indexOf("")) {
            let err = new ErrorObject(ErrorTypeEnum.PASWORD_PASSWORD2_OLD_PASSWORD_EMPTY);
            this.error(err);
            throw err;
        } else if(newPassword.value != newPassword2.value) {
            let err = new ErrorObject(ErrorTypeEnum.PASSWORD_NOT_EQUAL_PASSWORD2);
            this.error(err);
            throw err;
        }
        try {
            this.file.chgPassword(newPassword.value, oldPassword.value)
            await this.file.upload()
        } catch(e) {
            newPassword .value=""
            newPassword2.value=""
            oldPassword.value=""
            throw e
        }
    }
    
    async waitDownload() {
        let self = this;
        if(this.downloadRedy) {
            return true;
        } else if(this.downloadFailed) {
            throw new ErrorObject(ErrorTypeEnum.DOWNLOAD_ERROR);
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
                    reject(new ErrorObject(ErrorTypeEnum.DOWNLOAD_ERROR));
                }
            },1000);
        }); 
    }

    showEncryptedData() {
        let txt = this.getItem(this.htmlItems.txtPlanInput).value
        this.file.encrypt(txt)
        this.getItem("txtEncodedInput").value = Uint8Array2String(this.file.__encryptedContent)
    }
};

SecretFileControllerService.htmlItems = {
    "fPassLoginPasswordInput"     : "fPassLoginPasswordInput",
    "fPassSaveNameButton"         : "fPassSaveNameButton",
    "fPassOpenFileSubmit"         : "fPassOpenFileSubmit",
    "fPassFilenameForm"           : "fPassFilenameForm",
    "fPassChangePasswordShowLink" : "fPassChangePasswordShowLink",
    "fPassNewPassword2Input"      : "fPassNewPassword2Input",
    "fPassChangePasswordHideLink" : "fPassChangePasswordHideLink",
    "fPassOldPasswordTr"          : "fPassOldPasswordTr",
    "fPassChangePasswordTitle"    : "fPassChangePasswordTitle",
    "fPassChangePasswordForm"     : "fPassChangePasswordForm",
    "fPassOldPasswordInput"       : "fPassOldPasswordInput",
    "fPassNewPasswordInput"       : "fPassNewPasswordInput",
    "pPassSubmit"                 : "pPassSubmit",
    "fPassLoginForm"              : "fPassLoginForm",
    "fPassNameInput"              : "fPassNameInput",
    "fPassTable"                  : "fPassTable",
    "secretFileMainDiv"           : "secretFileMainDiv"
};