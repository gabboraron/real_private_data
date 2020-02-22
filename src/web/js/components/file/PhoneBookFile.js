'use strict'
/*
// 1. layer is encrypted
// 2.layer
{
  "nick_name1":<encrypted_phone_book_data>,
  "nick_name1":<encrypted_phone_book_data>
}
// 3. layer
// {
  "full_name":"str",
  "phone_numbers":[
    {
      "type":"",
      "number":""
    }
  ]
  "address":"str",
  "description":"str"
}
*/

const PhoneNumberType = {
  mobil: 'mobil',
  home: 'home',
  office: 'office'
}

class PhoneBookNumber {
  /**
   * 
   * @param {string} phoneNumber 
   * @param {PhoneNumberType} ty 
   */
  constructor(phoneNumber, ty){
    this.phoneNumber = phoneNumber;
    this.ty = ty || PhoneNumberType.mobil;
  }
}

class PhoneBookContact extends SecretJson {
  
  /**
   * 
   * @param {IEncryptor} encryptor 
   * @param {string} fullName 
   * @param {string} address 
   * @param {string} description 
   * @param {Array<string>} phoneNumbers 
   */
  constructor(encryptor,
    fullName,
    address,
    description,
    phoneNumbers
  ) {
    super(encryptor)
    let obj = {
      "fullName": fullName || "",
      "address": address || "",
      "description": description || "",
      "phoneNumbers": phoneNumbers || []
    }
    this.encrypt(obj)
  }
  /**
   * 
   * @param {PhoneBookNumber} phbNumber 
   */
  addPhoneNumber(phbNumber) {
    let obj = this.decrypt()
    obj.phoneNumbers.push(phbNumber)
    this.encrypt(obj)
  }
  removePhoneNumber(idx) {
    let obj = this.decrypt()
    obj.phoneNumbers.splice(idx, 1)
    this.encrypt(obj)
  }

  modifyPhoneNumber(idx, phoneNumber) {
    let obj = this.decrypt()
    obj.phoneNumbers[idx].ty = phoneNumber.ty
    obj.phoneNumbers[idx].phoneNumber = phoneNumber.phoneNumber
    this.encrypt(obj)
  }

  modify(fullName, address, description) {
    let obj = this.decrypt()
    obj.fullName = typeof(fullName) !== "undefined" ? fullName : obj.fullName
    obj.address = typeof(address) !== "undefined" ? address : obj.address
    obj.description = typeof(description) !== "undefined" ? description : obj.description
    this.encrypt(obj)
  }
}
PhoneBookContact.fromEncrypted = function(encrypted, encryptor) {
  let phbContact = new PhoneBookContact(encryptor)
  phbContact.__encryptedContent = encrypted
  return phbContact
}

class PhoneBookFile extends SecretFile {
  constructor () {
    super()
    this.type = 'phb'
  }

  start () {
    return super.start()
  }

  stop () {
    return super.start()
  }

  getNickNames() {
    let layer2 = this.__getLayer2();
    return Object.keys(layer2);
  }

  addContact(nickName,
    fullName,
    address,
    description,
    phoneNumbers) {
    let contact = new PhoneBookContact(this.__contentEncryptor,
      fullName,
      address,
      description,
      phoneNumbers
    );
    let phbObj = this.__getLayer2()
    if ("undefined" !== typeof(phbObj[nickName])) {
      throw new ErrorObject("The contact has been already in the contact list")
    }
    phbObj[nickName] = Array.from(contact.getEncryptedContent())
    this.encrypt(JSON.stringify(phbObj))
  }
  
  modifyContact(nickName, fullName, address, description) {
    let layer2 = this.__getLayer2()
    if ("undefined" === typeof(layer2[nickName])) {
      throw new ErrorObject("Contact not found")
    }
    let contact = PhoneBookContact.fromEncrypted(Uint8Array.from(layer2[nickName]), this.__contentEncryptor)
    contact.modify(fullName, address, description)
    layer2[nickName] = Array.from(contact.getEncryptedContent())
    this.encrypt(JSON.stringify(layer2))
  }
  /**
   * 
   * @param {string} nickName 
   */
  getContact(nickName) {
    let layer2 = this.__getLayer2()
    let contact = PhoneBookContact.fromEncrypted(Uint8Array.from(layer2[nickName]), this.__contentEncryptor)
    return contact.decrypt()
  }
  
  removeContact(nickName) {
    let layer2 = this.__getLayer2()
    if ( "undefined" === typeof(layer2[nickName])) {
      throw ErrorObject("Contact not found")
    }
    delete layer2[nickName]
    this.encrypt(JSON.stringify(layer2))
  }

  chgNickName(oldNickName, newNickName) {
    let layer2 = this.__getLayer2()
    if ( "undefined" === typeof(layer2[oldNickName])) {
      throw ErrorObject("Contact not found")
    }
    if ( "undefined" !== typeof(layer2[newNickName])) {
      throw ErrorObject("Contact has been already exist")
    }
    layer2[newNickName] = layer2[oldNickName]
    delete layer2[oldNickName]
    this.encrypt(JSON.stringify(layer2))
  }
  
  addPhoneNumber(nickName, phoneNumber) {
    let layer2 = this.__getLayer2()
    let contact = PhoneBookContact.fromEncrypted(Uint8Array.from(layer2[nickName]), this.__contentEncryptor)
    contact.addPhoneNumber(phoneNumber)
    layer2[nickName] = Array.from(contact.getEncryptedContent())
    this.encrypt(JSON.stringify(layer2))
  }

  removePhoneNumber(nickName, idx){
    let layer2 = this.__getLayer2()
    let contact = PhoneBookContact.fromEncrypted(Uint8Array.from(layer2[nickName]), this.__contentEncryptor)
    contact.removePhoneNumber(idx)
    layer2[nickName] = Array.from(contact.getEncryptedContent())
    this.encrypt(JSON.stringify(layer2))
  }

  modifyPhoneNumber(nickName, idx, phoneNumber){
    let layer2 = this.__getLayer2()
    let contact = PhoneBookContact.fromEncrypted(Uint8Array.from(layer2[nickName]), this.__contentEncryptor)
    contact.modifyPhoneNumber(idx, phoneNumber)
    layer2[nickName] = Array.from(contact.getEncryptedContent())
    this.encrypt(JSON.stringify(layer2))
  }

  clear() {
    this.encrypt("{}")  
  }

  changeContentEncryptor(newEncryptor, oldEncryptor) {
    if(typeof(oldEncryptor) === undefined) {
      oldEncryptor = this.__contentEncryptor;
    }
    let currEncryptor = this.__contentEncryptor;
    this.__contentEncryptor = oldEncryptor;
    try {
        let text = this.decrypt().txt;
        this.__contentEncryptor = newEncryptor;
        let layer2 = JSON.parse(text)
        let nickNames = Object.keys(layer2)
        for(let i = 0; i < nickNames.length; ++i ) {
          let nickName = nickNames[i]
          let contact = oldEncryptor.decryptToString(layer2[nickName])
          layer2[nickName] = Array.from(newEncryptor.encryptFromString(contact))
        }
        let json = JSON.stringify(layer2)
        this.encrypt(json);
    } catch(e){
        this.__contentEncryptor = currEncryptor;
        throw e;
    }
  }
  chgPassword(newPlainPassword, oldPlainPassword) {
    let newEncryptor = theEncryptor.fromString(newPlainPassword);
    let oldEncryptor = undefined;
    if(oldPlainPassword)
        oldEncryptor = theEncryptor.fromString(oldPlainPassword);
    return this.changeContentEncryptor(newEncryptor, oldEncryptor);
  }
  
  __getLayer2() {
    let txt = this.decrypt().txt
    return JSON.parse(txt)
  }

}


PhoneBookFile.createEmptyPhonebook = 
/**
 * 
 * @param {string} password 
 */
function(password) {
  let phbFile = new PhoneBookFile();
  phbFile.setPassword(password, false);
  phbFile.setNameEncryptor(theEncryptor.fromHexString(theUserManager.__dirHash));
  phbFile.clear()
  return phbFile
}

function testPhoneBookFile() {
  let phb = PhoneBookFile.createEmptyPhonebook("almafa");
  phb.addContact("Pista", "Kis Pista", "1111. Budapest, Alma utca 2.","almafa")
  phb.addPhoneNumber("Pista", new PhoneBookNumber("06/30-232-1403"))
  let contacts = phb.getNickNames()
  console.log(contacts)
  let Pista = phb.getContact("Pista")
  console.log(Pista)
}