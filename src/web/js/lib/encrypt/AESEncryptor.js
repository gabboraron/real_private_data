'use strict';

class AESEncryptor extends IEncryptor {
    key;
    aesjs;

    /**
     * 
     * @param {UInt8Array} key 
     * @param {class} myAesjs 
     */
    constructor(key, myAesjs = aesjs) {
        super();
        this.key = key;
        this.aesjs = myAesjs;
    }
    
    start(){

    }
    
    stop(){
        remove(this, "key");
        remove(this, "aesjs");
    }

    /**
     * 
     * @param {string} data 
     */
    encryptFromString(data) {
        let hash = sha256(data);
        data = hash + data
        let aesCtr = new this.aesjs.ModeOfOperation.ctr(this.key);
        let textBytes = this.aesjs.utils.utf8.toBytes(data);
        let encryptedBytes = aesCtr.encrypt(textBytes);
        return encryptedBytes;
    }
    
    /**
     * 
     * @param {UInt8Array} data 
     */
    decryptToString(data) {
        let aesCtr = new this.aesjs.ModeOfOperation.ctr(this.key);
        let decrypted = this.aesjs.utils.utf8.fromBytes(aesCtr.decrypt(data));
        let hash = decrypted.substr(0, 64);
        let d = decrypted.substr(64);
        let hash2 = sha256(d);
        if(hash2 !== hash) {
            throw new ErrorObject(ErrorTypeEnum.DECRYPTION_FAILURE);
        }
        return d;
    }
    
    /**
     * 
     * @param {number} data 
     */
    encryptFromNumber(data) {
        //TODO better way
        return this.encryptFromString(data.toString());
    }
    
    /**
     * 
     * @param {UInt8Array} data 
     */
    decryptToNumber(data) {
        return Number(this.decryptToString(data));
    }
}

AESEncryptor.fromHexString = function(hexString, myAesjs) {
    return new AESEncryptor(byteStr2Uint8Array(hexString), myAesjs);
}

AESEncryptor.fromString = function(str, myAesjs) {
    let hexString = theHash.string(str);
    return new AESEncryptor(byteStr2Uint8Array(hexString), myAesjs);
}

// TODO: move to other place
function aesTest() {
    var key1 = sha256("alma");
    var key2 = sha256("alma2");
    var e1 = AESEncryptor.fromHexString(key1);
    var e1_2 = AESEncryptor.fromHexString(key1);
    var e2 = AESEncryptor.fromHexString(key2);
    var data = "pistike";
    var s1 = e1.encryptFromString(data);
    try {
        let descryted = e1.decryptToString(s1);
        if(descryted === data){
            console.log("Test ok");
        } else{
            console.error(decrypted + " != " + data);
        }
    } catch(e) {
        console.error(e);
    }

    try {
        let descryted = e1_2.decryptToString(s1);
        if(descryted === data){
            console.log("Test ok");
        } else{
            console.error(decrypted + " != " + data);
        }
    } catch(e) {
        console.error(e);
    }

    try {
        let descryted = e2.decryptToString(s1);
        if(descryted === data){
            console.error("Test error");
        } else {
            console.error(decrypted + " != " + data);
        }
    } catch(e) {
        console.log("Test ok:" + e.toString());
    }

    let n = 3;
    let nEncrypted = e1.encryptFromNumber(n);
    let nDecrypted = e1_2.decryptToNumber(nEncrypted);
    if(n === nDecrypted ) {
        console.log("OK: "+n+" === "+nDecrypted);
    }
    else {
        console.error("Error: "+n+" !== "+nDecrypted)
    }
}