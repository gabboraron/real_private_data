'use strict';
class MainControllerService extends ControllerServiceBase {
    constructor() {
        super();
    }
    
    htmlItems = {
        "logoutLink"         : "logoutLink",
        "createUserLink"     : "createUserLink",
        "changePasswordLink" : "changePasswordLink",
        "createTxtFileLink"  : "createTxtFileLink",
        "createPhbFileLink"  : "createPhbFileLink",
        "mainFilesTable"     : "mainFilesTable"
    }

    start(body) {
        super.start(body);
        this.addEventListener(this.htmlItems.changePasswordLink, "click", this.openPage);
        this.addEventListener(this.htmlItems.createUserLink, "click", this.openPage);
        this.addEventListener(this.htmlItems.createTxtFileLink, "click", this.openPage);
        this.addEventListener(this.htmlItems.createPhbFileLink, "click", this.openPage);
        if(theConfig.enable_create_user) {
            this.showElement(this.getItem("createUserNavItem"))
        }
        this.listFiles(true);
    }
    
    stop(){
        super.stop();
    }
    
    openPage(elementName, e, t){
        switch(elementName){
            case this.htmlItems.createUserLink:
                thePageLoader.loadPage("createUser", undefined, true);
                break;
            case this.htmlItems.changePasswordLink:
                thePageLoader.loadPage("chgPassword", undefined, true);
                break;
            case this.htmlItems.createTxtFileLink:
                thePageLoader.loadPage("txtFile", undefined, true);
                break;
            case this.htmlItems.createPhbFileLink:
                thePageLoader.loadPage("phoneBookFile", undefined, true);
                break;
        }
    }

    async listFiles(refresh = false) {
        let files = await theDirManager.showFiles(refresh);
        files.sort((a, b) => {
            return insensitiveCompare(a.decryptedName, b.decryptedName)
        })
        let mainTable = this.getItem("mainFilesTable");
        mainTable.innerHTML = "";
        for(let i = 0; i < files.length; ++i) {
            let tr = this.createFileTr( files[i], i)
            mainTable.appendChild(tr);
        }
        
    }

    createFileTr(f, i){
        let self = this;
        let tr = document.createElement("tr");
        tr.classList.add((0 === i % 2)?"oddRow":"evenRow")
        let link = createLink(f.decryptedName, () => {
            self.openFile(f.encryptedName);
        })
        link.classList.add("mainOpenFile");
        let fileNameTd = document.createElement("td");
        fileNameTd.appendChild(link);
        tr.appendChild(fileNameTd);

        let typeTd = document.createElement("td");
        typeTd.innerText = f.decryptedName.match(/[.]([^.]+)$/)[1];
        tr.appendChild(typeTd);

        let renameTd = document.createElement("td")
        let renameLink = createButton("Rename", () => {
            self.renameHandler(fileNameTd, f);
        })
        renameLink.classList.add("btn")
        renameLink.classList.add("btn-secondary")
        renameLink.classList.add("btn-sm")

        renameTd.appendChild(renameLink)
        tr.appendChild(renameTd)
        
        let deleteTd = document.createElement("td")
        let deleteLink = createButton("Delete", () => {
            self.deleteHandler(f)
        })
        deleteTd.appendChild(deleteLink)
        tr.appendChild(deleteTd)

        return tr;
    }

    async deleteHandler(f) {
        let fnameString = Uint8Array2String(f.encryptedName)
        try {
            await theDirManager.removeFile(fnameString)
            this.message("File delete is ready")
        } catch(e) {
            this.error(e.toString())
        }
        this.listFiles(true)
    }

    async renameHandler(fileNameTd, f) {
        let self = this;
        fileNameTd.innerHTML = ""
        let renameForm = document.createElement("form") 
        let renameInput = document.createElement("input")
        renameInput.value = f.decryptedName
        renameForm.appendChild(renameInput)
        
        let renameSaveButton = createButton("Save", ()=>{}, "submit")
        renameForm.appendChild(renameSaveButton)
        
        let renameCancelLink = createButton("Cancel", () => {
            self.listFiles(true)
        })
        renameForm.appendChild(renameCancelLink)
        renameForm.addEventListener("submit", (e) => {
            self.renameSubmitHandler(e, f, renameInput)
        })
        fileNameTd.appendChild(renameForm)
    }
    
    async renameSubmitHandler(e, f, renameInput) {
        e.preventDefault()
        let oldName = f.decryptedName
        let newName = renameInput.value
        let extOld = oldName.match(/[.][^.]+$/)[0]
        let extNew = newName.match(/[.][^.]+$/)[0]
        if(extOld !== extNew) {
            newName += extOld
        }
        if("" === newName)
        {
            this.error("Empty file name")
            return
        } else if(newName === oldName) {
            this.error("Old name and new name are equal")
            return
        }
        try {
            // HACK
            let nameEncryptor = theEncryptor.fromHexString(theUserManager.__dirHash)
            let encryptedOldNameBytes = nameEncryptor.encryptFromString(oldName)
            let encryptedNewNameBytes = nameEncryptor.encryptFromString(newName)
            
            await theDirManager.renameFile(
                Uint8Array2String(encryptedOldNameBytes),
                Uint8Array2String(encryptedNewNameBytes)
            )
            this.message("Rename file is ready")
            this.listFiles(true)
        } catch(e) {
            this.error(e.toString())
        }
    }

    openFile(encryptedName) {
        const type2Page = {
            "txt" : "txtFile",
            "phb" : "phoneBookFile"
        }
        let f = theDirManager.openFile(encryptedName);
        thePageLoader.loadPage(type2Page[f.type], undefined, true, f);
    }
}