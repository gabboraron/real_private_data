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
        } catch(e) {
            this.message(e.toString());
            return false;
        }
        this.initFile(this.body);
    }

    async openFile(elementName, e, t) {
        try {
            await super.openFile(elementName, e, t);
            this.listContacts()
            //this.getItem(this.htmlItems.).innerText = decrypted.modifyDate
        } catch(e) {
            this.message(e)
        }
    }

    createAddContact(element) {
        let html = theHtmlDownloaderService.getHtml("phoneBookModifyContact")
        html.getElementsByClassName("phbAddNumberButton")[0].addEventListener("click", () => {
            let numbersDiv = html.getElementsByClassName("phbPhoneNumbers")[0]
            let numDiv = this.createPhoneNuberInput().numDiv
            numbersDiv.appendChild(numDiv)
        })
        element.innerHTML = ""
        element.appendChild(html)
    }

    showContactModifier(element, nickName) {
        let self = this
        let html = theHtmlDownloaderService.getHtml("phoneBookModifyContact")
        html.getElementsByClassName("phbPhoneNumbersTr")[0].style = "display: none"
        let contact = this.file.getContact(nickName)
        html.getElementsByClassName("phbNickName")[0].value = nickName
        html.getElementsByClassName("phbFullName")[0].value = contact.fullName
        html.getElementsByClassName("phbAddress")[0].value = contact.address
        html.getElementsByClassName("phbDescription")[0].value = contact.description
        html.getElementsByClassName("phbModifyContactSaveButton")[0].addEventListener("click", async (e) => {
            e.preventDefault()
            let newNickName = html.getElementsByClassName("phbNickName")[0].value
            if(newNickName !== nickName) {
                self.file.chgNickName(nickName, newNickName)
            }
            self.file.modifyContact(
                newNickName,
                html.getElementsByClassName("phbFullName")[0].value,
                html.getElementsByClassName("phbAddress")[0].value,
                html.getElementsByClassName("phbDescription")[0].value
            )
            await this.file.upload()
            //HACK
            if(newNickName !== nickName) {
                let nickNameLinks = document.getElementsByClassName("nickNameLinkInContainer")
                for(let i = 0; i < nickNameLinks.length; ++i) {
                    if(nickNameLinks[i].innerText === nickName) {
                        nickNameLinks[i].innerText = newNickName
                        break
                    }
                }
            }
            this.showContact(element, newNickName, true)
        })
        html.getElementsByClassName("phbModifyContactCancelButton")[0].addEventListener("click", (e) => {
            e.preventDefault()
            this.showContact(element, nickName, true)
        })
        element.innerHTML = ""
        element.appendChild(html)
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
            let modifyLink = createButton("Save", async () => {
                let pbn = new PhoneBookNumber(
                    numHtmls.phoneNumberInput.value, 
                    numHtmls.typeSelect.value
                )
                self.file.modifyPhoneNumber(nickName, idx, pbn)
                await self.file.upload()
                self.showContact(tdDetails, nickName, true)
            })
            let cancelLink = createButton("Cancel", async () => {
                self.showContact(tdDetails, nickName, true)
            })
            let divideSpan = document.createElement("span")
            divideSpan.innerText = " "
            numHtmls.numDiv.appendChild(modifyLink)
            numHtmls.numDiv.appendChild(divideSpan)
            numHtmls.numDiv.appendChild(cancelLink)
        }
        return numHtmls.numDiv
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
            this.file.setName(this.getItem("fPassNameInput").value)
            // FIXME: hack
            await this.file.upload(this.isCreate)
            this.isCreate = false
            
            this.clearAddContact()
        } catch(e) {
            this.message(e.toString())
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
            let nickNameTd = document.createElement("td")
            let nickNameLink = document.createElement("a")
            nickNameLink.href = "#"
            nickNameLink.classList.add("nickNameLinkInContainer")
            let tdDetails = document.createElement("td")
            nickNameLink.addEventListener("click", (e) => {
                e.preventDefault()
                self.showContact(tdDetails, nickName)
            });
            nickNameLink.innerText = nickName
            nickNameTd.appendChild(nickNameLink)
            tr.appendChild(nickNameTd)
            
            let modifyTd = document.createElement("td")
            let modifyLink = createButton("Modify", () => {
                this.showContactModifier(tdDetails, nickName)
            })
            modifyTd.appendChild(modifyLink)
            tr.appendChild(modifyTd)

            let deleteTd = document.createElement("td")
            let deleteLink = createButton("Delete", async (e) => {
                e.preventDefault()
                try {
                    this.file.removeContact(nickName)
                    await this.file.upload()
                    self.listContacts()
                } catch(e) {
                    this.message(e.toString())
                }

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
    
    showContact(tdDetails, nickName, force = false) {
        let self = this
        let clear = tdDetails.innerHTML !== "" && !force
        tdDetails.innerHTML = ""
        if(clear) {
            return
        }
        let contact = this.file.getContact(nickName)
        let html = theHtmlDownloaderService.getHtml("phoneBookContact")
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
                numberTd.innerHTML = ""
                let numberDiv = self.createPhoneNumberModifier(phoneNumber.phoneNumber, phoneNumber.ty, nickName, i, tdDetails, true)
                numberTd.appendChild(numberDiv)
                e.preventDefault()
            })
            numberModifyTd.appendChild(numberModifyLink) 
            let numberDeleteTd = document.createElement("td")
            let numberDeleteLink = createButton("Delete", async (e) => {
                self.file.removePhoneNumber(nickName, i)
                await self.file.upload()
                self.showContact(tdDetails, nickName, true)
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
        let addPhoneNumberButton = document.createElement("input")
        addPhoneNumberButton.type = "button"
        addPhoneNumberButton.value = "Add phone number"
        addPhoneNumberButton.addEventListener("click", (e) => {
            e.preventDefault()
            let phoneInput = self.createPhoneNuberInput()
            let saveLink = createButton("Save", async () => {
                await self.file.addPhoneNumber(
                    nickName,
                    new PhoneBookNumber(
                        phoneInput.phoneNumberInput.value,
                        phoneInput.typeSelect.value
                    )
                )
                await self.file.upload()
                self.showContact(tdDetails, nickName, true)
            })
            phoneInput.numDiv.appendChild(saveLink)
            td.appendChild(phoneInput.numDiv)
        })
        td.appendChild(addPhoneNumberButton)
        tr.appendChild(td)
        phoneNumbersTable.appendChild(tr)
        html.getElementsByClassName("phbContactPhoneNumbers")[0].appendChild(phoneNumbersTable)
        
        tdDetails.innerHTML = "";
        tdDetails.appendChild(html)
    }
}

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