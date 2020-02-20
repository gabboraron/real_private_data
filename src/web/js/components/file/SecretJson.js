"use strict";

class SecretJson
{
    constructor(contentEncryptor, encryptedContent) {
        this.__encryptedContent = encryptedContent
        this.__contentEncryptor = contentEncryptor
    }

    start() {
    }

    stop() {
      remove(this, "__encryptedContent");
      remove(this, "__contentEncryptor");
    }
    /**
     * 
     * @param {IEncryptor} contentEncryptor 
     */
    setContentEncryptor(contentEncryptor, check = false) {
        isInheritedFrom(contentEncryptor, IEncryptor);
        if(this.__contentEncryptor !== undefined) {
            throw "use changeContentEncryptor instead of setContentEncryptor";
        }
        this.__contentEncryptor = contentEncryptor;
        console.error("TODO: check it")
        if(check){

        }
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
            this.encrypt(text);
        } catch(e){
            this.__contentEncryptor = currEncryptor;
            throw e;
        }
    }
    
    /**
     * 
     * @param {Object} obj
     */
    encrypt(obj) {
        let txt = JSON.stringify(obj);
        this.__encryptedContent = this.__contentEncryptor.encryptFromString(txt);
    }
    
    decrypt() {
        let rawDecrypted = this.__contentEncryptor.decryptToString(this.__encryptedContent);
        return JSON.parse(rawDecrypted);
    }

    getEncryptedContent() {
        return this.__encryptedContent;
    }
};

