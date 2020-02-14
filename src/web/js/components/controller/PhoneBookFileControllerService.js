'use strict'
class PhoneBookFileControllerService extends SecretFileControllerService {
    constructor() {
        super();
    }

    start(body, file) {
        this.file = file || theFileFactory.createFile("phb");
        super.start(body, file);
        let modifier = this.getItem(this.htmlItems.phbAddContact)
        this.showContactModifier(modifier)
        this.addEventListener("phbShowAddContactButton", "click", this.showAddContact)
        this.addEventListener("phbModifyContactCancelButton", "click", this.hideAddContact)
        this.addEventListener("phbModifyContactSaveButton", "click", this.addContact)
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
            } catch(e) {
                this.message(e.toString());
                return false;
            }
        }
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
        this.getItem(this.htmlItems.secretFileMainDiv).style = "display: block;";
        this.getItem(this.htmlItems.fPassLoginForm).style = "display:none;";
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

    /**
     * 
     * @param {HTMLElement} element 
     */
    showContactModifier(element, nickName) {
        let html = theHtmlDownloaderService.getHtml("phoneBookModifyContact")
        html.getElementsByClassName("phbAddNumberButton")[0].addEventListener("click", () => {
            let numbersDiv = html.getElementsByClassName("phbPhoneNumbers")[0]
            let numDiv = document.createElement("div")
            numDiv.classList.add("phbAddPhoneNumberDiv")
            let select = document.createElement("select")
            select.classList.add("phoneNumberTypeSelect")
            let phonebookTypes = Object.keys(PhoneNumberType)
            for(let i = 0; i< phonebookTypes.length; ++i) {
                let option = document.createElement("option")
                option.innerText = phonebookTypes[i]
                option.value = phonebookTypes[i]
                select.appendChild(option)
            }
            numDiv.appendChild(select)
            let phoneNumber = document.createElement("input")
            phoneNumber.classList.add("phoneNumberInput")

            numDiv.appendChild(phoneNumber)
            numbersDiv.appendChild(numDiv)
        })
        element.innerHTML = ""
        element.appendChild(html)
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
            await this.file.upload(true)
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
    }
    listContacts(){
        let self = this
        let contacts = this.file.getNickNames()
        let table = document.createElement("table")
        for(let i = 0; i < contacts.length; ++i) {
            let tr = document.createElement("tr")
            let nickNameTd = document.createElement("td")
            let nickNameLink = document.createElement("a")
            nickNameLink.href = "#"
            let tdDetails = document.createElement("td")
            nickNameLink.addEventListener("click", (e) => {
                e.preventDefault()
                self.showContact(tdDetails, contacts[i])
            });
            nickNameLink.innerText = contacts[i]
            nickNameTd.appendChild(nickNameLink)
            tr.appendChild(nickNameTd)
            table.appendChild(tr)
            let trDetails = document.createElement("tr")
            trDetails.appendChild(tdDetails)
            tdDetails.colSpan = tr.childElementCount
            table.appendChild(trDetails)
        }
        this.getItem("phbContacts").innerHTML = "";
        this.getItem("phbContacts").appendChild(table)
    }
    
    showAddPhoneNumber() {
    }
    
    showContact(tdDetails, nickName) {
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
            let tr = document.createElement("tr")
            tr.appendChild(typeTd)
            tr.appendChild(numberTd)
            phoneNumbersTable.appendChild(tr)
        }
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