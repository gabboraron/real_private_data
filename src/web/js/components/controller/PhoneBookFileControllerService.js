'use strict'
class PhoneBookFileControllerService extends SecretFileControllerService {
    constructor() {
        super();
    }

    start(body, file) {
        this.file = file || theFileFactory.createFile("phb");
        super.start(body, file);
        let modifier = this.getItem(this.htmlItems.phbAddContact)
        this.createAddContact(modifier)
        this.addEventListener("phbShowAddContactButton", "click", this.showAddContact)
        this.addEventListener("phbModifyContactCancelButton", "click", this.hideAddContact)
        this.addEventListener("phbModifyContactSaveButton", "click", this.addContact)
    }
    
    stop() {
        super.stop();
    }

    async createFile() {
        console.debug("createFile");
        this.setName();
        try{
            await this.file.upload(true);
            this.showEncryptedData()
            this.message("File created successfully")
        } catch(e) {
            this.error(e.toString());
            return false;
        }
        this.initFile(this.body);
    }

    async openFile(elementName, e, t) {
        try {
            await super.openFile(elementName, e, t)
            this.showEncryptedData()
            this.listContacts()
            //this.getItem(this.htmlItems.).innerText = decrypted.modifyDate
        } catch(e) {
            this.error(e)
        }
    }

    createAddContact(element) {
        let self = this;
        let html = theHtmlDownloaderService.getBody("phoneBookModifyContact")
        html.getElementsByClassName("phbAddNumberButton")[0].addEventListener("click", (e) => {
            self.phbAddNumberButtonHandler(e, html)
        })
        element.innerHTML = ""
        element.appendChild(html)
    }

    phbAddNumberButtonHandler(e, html) {
        e.preventDefault()
        let numbersDiv = html.getElementsByClassName("phbPhoneNumbers")[0]
        let numDiv = this.createPhoneNuberInput().numDiv
        numbersDiv.appendChild(numDiv)
    }

    showContactModifier(element, nickName) {
        let self = this
        let html = theHtmlDownloaderService.getBody("phoneBookModifyContact")
        html.getElementsByClassName("phbPhoneNumbersTr")[0].style = "display: none"
        let contact = this.file.getContact(nickName)
        html.getElementsByClassName("phbNickName")[0].value = nickName
        html.getElementsByClassName("phbFullName")[0].value = contact.fullName
        html.getElementsByClassName("phbAddress")[0].value = contact.address
        html.getElementsByClassName("phbDescription")[0].value = contact.description
        html.getElementsByClassName("phbModifyContactSaveButton")[0].addEventListener("click", (e) => {
            self.phbModifyContactSaveButtonHandler(e, html, nickName, element)
        })
        html.getElementsByClassName("phbModifyContactCancelButton")[0].addEventListener("click", (e) => {
            e.preventDefault()
            this.showContact(element, nickName, true)
        })
        element.innerHTML = ""
        element.appendChild(html)
    }

    async phbModifyContactSaveButtonHandler(e, html, nickName, element) {
        e.preventDefault()
        let newNickName = html.getElementsByClassName("phbNickName")[0].value
        try {
            if(newNickName !== nickName) {
                this.file.chgNickName(nickName, newNickName)
            }
            this.file.modifyContact(
                newNickName,
                html.getElementsByClassName("phbFullName")[0].value,
                html.getElementsByClassName("phbAddress")[0].value,
                html.getElementsByClassName("phbDescription")[0].value
            )
            await this.file.upload()
            this.showEncryptedData()
            this.message("Modification is ready")
        } catch(e) {
            this.error(e)
            return
        }
        //HACK
        if(newNickName !== nickName) {
            this.listContacts()
        } else {
            this.showContact(element, newNickName, true)
        }
    }
    createPhoneNuberInput(phoneNumber = "", ty = "mobil") {
        let numDiv = document.createElement("div")
        numDiv.classList.add("phbAddPhoneNumberDiv")
        let typeSelect = document.createElement("select")
        typeSelect.classList.add("phoneNumberTypeSelect")
        let phonebookTypes = Object.keys(PhoneNumberType)
        for(let i = 0; i< phonebookTypes.length; ++i) {
            let option = document.createElement("option")
            option.innerText = phonebookTypes[i]
            option.value = phonebookTypes[i]
            typeSelect.appendChild(option)
        }
        typeSelect.value = ty
        numDiv.appendChild(typeSelect)
        let phoneNumberInput = document.createElement("input")
        phoneNumberInput.classList.add("phoneNumberInput")
        phoneNumberInput.value = phoneNumber
        numDiv.appendChild(phoneNumberInput)
        return {
            "numDiv": numDiv,
            "phoneNumberInput": phoneNumberInput,
            "typeSelect":typeSelect
        }
    }

    createPhoneNumberModifier(phoneNumber = "", 
        ty = "mobil", 
        nickName, 
        idx, 
        tdDetails,
        addButtons = false 
        ) {
        let self = this
        let numHtmls = this.createPhoneNuberInput(phoneNumber, ty)

        if(addButtons) {
            let modifySaveLink = createButton("Save", () => {
                self.modifySaveHandler(numHtmls, tdDetails, nickName, idx)
            })
            let cancelLink = createButton("Cancel", () => {
                self.showContact(tdDetails, nickName, true)
            })
            let divideSpan = document.createElement("span")
            divideSpan.innerText = " "
            numHtmls.numDiv.appendChild(modifySaveLink)
            numHtmls.numDiv.appendChild(divideSpan)
            numHtmls.numDiv.appendChild(cancelLink)
        }
        return numHtmls.numDiv
    }
    
    async modifySaveHandler(numHtmls, tdDetails, nickName, idx) {
        let pbn = new PhoneBookNumber(
            numHtmls.phoneNumberInput.value, 
            numHtmls.typeSelect.value
        )
        this.file.modifyPhoneNumber(nickName, idx, pbn)
        await this.file.upload()
        this.showEncryptedData()
        this.showContact(tdDetails, nickName, true)
    }
    
    async addContact(elementName, e, t) {
        let addContactDiv = this.getItem("phbAddContact")
        try {
            let nickName = addContactDiv.getElementsByClassName("phbNickName")[0].value
            this.file.addContact(
                nickName,
                addContactDiv.getElementsByClassName("phbFullName")[0].value,
                addContactDiv.getElementsByClassName("phbAddress")[0].value,
                addContactDiv.getElementsByClassName("phbDescription")[0].value
            )
            let numberDivs = addContactDiv.getElementsByClassName("phbAddPhoneNumberDiv")
            for(let i = 0; i < numberDivs.length; ++i ) {
                let numberDiv = numberDivs[i]
                let phoneNumberType = numberDiv.getElementsByClassName("phoneNumberTypeSelect")[0].value
                let phoneNumber = numberDiv.getElementsByClassName("phoneNumberInput")[0].value
                this.file.addPhoneNumber(nickName, new PhoneBookNumber(phoneNumber, phoneNumberType))
            }
            if(this.isCreate) {
                this.file.setName(this.getItem("fPassNameInput").value)
            }
            // FIXME: hack
            await this.file.upload(this.isCreate)
            this.showEncryptedData()
            this.message("Contact added")
            this.isCreate = false
            
            this.clearAddContact()
        } catch(e) {
            this.error(e.toString())
        }

        this.listContacts()
    }

    showAddContact() {
        this.getItem(this.htmlItems.phbAddContact).style = "display: block;"
    }

    hideAddContact() {
        this.getItem(this.htmlItems.phbAddContact).style = "display: none;"
        this.clearAddContact()
    }
    
    clearAddContact() {
        let addContactDiv = this.getItem("phbAddContact")
        addContactDiv.getElementsByClassName("phbNickName")[0].value = ""
        addContactDiv.getElementsByClassName("phbFullName")[0].value = ""
        addContactDiv.getElementsByClassName("phbAddress")[0].value = ""
        addContactDiv.getElementsByClassName("phbDescription")[0].value = ""
        addContactDiv.getElementsByClassName("phbPhoneNumbers")[0].innerHTML = ""
    }

    listContacts(){
        let self = this
        let contacts = this.file.getNickNames()
        contacts.sort(insensitiveCompare)
        let table = document.createElement("table")
        table.classList.add("phbContactContainerTable")
        for(let i = 0; i < contacts.length; ++i) {
            let nickName = contacts[i]
            let tr = document.createElement("tr")
            tr.classList.add((0 === i % 2)?"oddRow":"evenRow")
            let nickNameTd = document.createElement("td")
            let tdDetails = document.createElement("td")
            let nickNameLink = createLink(nickName, () => {
                self.showContact(tdDetails, nickName)
            })
            nickNameLink.classList.add("nickNameLinkInContainer")
            nickNameTd.appendChild(nickNameLink)
            tr.appendChild(nickNameTd)
            
            let modifyTd = document.createElement("td")
            let modifyLink = createButton("Modify", () => {
                self.showContactModifier(tdDetails, nickName)
            })
            modifyTd.appendChild(modifyLink)
            tr.appendChild(modifyTd)

            let deleteTd = document.createElement("td")
            let deleteLink = createButton("Delete", (e) => {
                self.deleteContactButtonHandler(e, nickName)
            })
            deleteTd.appendChild(deleteLink)
            tr.appendChild(deleteTd)
            
            table.appendChild(tr)
            let trDetails = document.createElement("tr")
            trDetails.appendChild(tdDetails)
            tdDetails.colSpan = tr.childElementCount
            table.appendChild(trDetails)
        }
        this.getItem("phbContacts").innerHTML = "";
        this.getItem("phbContacts").appendChild(table)
    }
    
    async deleteContactButtonHandler(e, nickName) {
        e.preventDefault()
        try {
            this.file.removeContact(nickName)
            await this.file.upload()
            this.showEncryptedData()
            this.listContacts()
        } catch(e) {
            this.error(e.toString())
        }
    }

    showContact(tdDetails, nickName, force = false) {
        let self = this
        let clear = tdDetails.innerHTML !== "" && !force
        tdDetails.innerHTML = ""
        if(clear) {
            return
        }
        let contact = this.file.getContact(nickName)
        let html = theHtmlDownloaderService.getBody("phoneBookContact")
        html.getElementsByClassName("phbContactNickName")[0].innerText = nickName
        html.getElementsByClassName("phbContactFullname")[0].innerText = contact.fullName
        html.getElementsByClassName("phbContactAddress")[0].innerText = contact.address
        html.getElementsByClassName("phbContactDescription")[0].innerText = contact.description

        let phoneNumbersTable = document.createElement("table")
        for(let i = 0; i < contact.phoneNumbers.length; ++i) {
            let phoneNumber = contact.phoneNumbers[i]
            let typeTd = document.createElement("td")
            typeTd.innerText = phoneNumber.ty
            let numberTd = document.createElement("td")
            numberTd.innerText = phoneNumber.phoneNumber
            let numberModifyTd = document.createElement("td")
            let numberModifyLink = createButton("Modify", (e) => {
                self.numberModifyHandler(e, numberTd, phoneNumber, nickName, i, tdDetails)
            })
            numberModifyTd.appendChild(numberModifyLink) 
            let numberDeleteTd = document.createElement("td")
            let numberDeleteLink = createButton("Delete", () => {
                self.numberDeleteHandler(nickName, i, tdDetails)
            })
            numberDeleteTd.appendChild(numberDeleteLink)
            let tr = document.createElement("tr")
            tr.appendChild(typeTd)
            tr.appendChild(numberTd)
            tr.appendChild(numberModifyTd)
            tr.appendChild(numberDeleteTd)
            phoneNumbersTable.appendChild(tr)
        }
        let tr = document.createElement("tr")
        let td = document.createElement("td")
        let addPhoneNumberButton = createButton("Add phone number", () => {
            self.addPhoneNumberButtonHandler(td, nickName, tdDetails)
        })
        td.appendChild(addPhoneNumberButton)
        tr.appendChild(td)
        phoneNumbersTable.appendChild(tr)
        html.getElementsByClassName("phbContactPhoneNumbers")[0].appendChild(phoneNumbersTable)
        
        tdDetails.innerHTML = "";
        tdDetails.appendChild(html)
    }
    
    numberModifyHandler(e, numberTd, phoneNumber, nickName, i, tdDetails) {
        e.preventDefault()
        numberTd.innerHTML = ""
        let numberDiv = this.createPhoneNumberModifier(phoneNumber.phoneNumber,
                                                       phoneNumber.ty,
                                                       nickName,
                                                       i,
                                                       tdDetails,
                                                       true)
        numberTd.appendChild(numberDiv)
    }

    async numberDeleteHandler(nickName, i, tdDetails) {
        this.file.removePhoneNumber(nickName, i)
        await this.file.upload()
        this.showEncryptedData()
        this.showContact(tdDetails, nickName, true)
    }

    addPhoneNumberButtonHandler(td, nickName, tdDetails) {
        let self = this;
        let phoneInput = this.createPhoneNuberInput()
        let saveLink = createButton("Save", () => {
            self.phoneNumberSaveHandler(nickName, phoneInput, tdDetails)
        })
        phoneInput.numDiv.appendChild(saveLink)
        td.appendChild(phoneInput.numDiv)
    }

    async phoneNumberSaveHandler(nickName, phoneInput, tdDetails) {
        await this.file.addPhoneNumber(
            nickName,
            new PhoneBookNumber(
                phoneInput.phoneNumberInput.value,
                phoneInput.typeSelect.value
            )
        )
        await this.file.upload()
        this.showEncryptedData()
        this.showContact(tdDetails, nickName, true)
    }

    showEncryptedData() {
        if(!theConfig.show_encrypted_data){
            return
        }
        this.getItem("txtEncodedInput").value = Uint8Array2String(this.file.__encryptedContent)
        this.getItem("txtEncodedInputLayer2").value = this.file.getLayer2Str()
    }
} // end of PhoneBookFileControllerService

PhoneBookFileControllerService.htmlItems = {
    "phbNickName"                  : "phbNickName",
    "secretFileMainDiv"            : "secretFileMainDiv",
    "txtFileBackLink"              : "txtFileBackLink",
    "phbModifyContactSaveButton"   : "phbModifyContactSaveButton",
    "phbAddress"                   : "phbAddress",
    "phbModifyContact"             : "phbModifyContact",
    "phbAddContact"                : "phbAddContact",
    "phbContacts"                  : "phbContacts",
    "phbModifyContactCancelButton" : "phbModifyContactCancelButton",
    "fPassSaveButton"              : "fPassSaveButton",
    "phbDescription"               : "phbDescription",
    "filePasswordMainDiv"          : "filePasswordMainDiv",
    "logoutLink"                   : "logoutLink",
    "txtEncodedInput"              : "txtEncodedInput",
    "phbPhoneNumbers"              : "phbPhoneNumbers",
    "phbPlanInput"                 : "phbPlanInput",
    "phbFullName"                  : "phbFullName"
};