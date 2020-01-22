'use strict';

class AESEncryptor extends IEncryptor {
    key /* :byte[] */;
    aesjs;
    constructor(key, myAesjs = aesjs) {
        super();
        this.key = key;
        this.aesjs = aesjs;
    }

    encryptFromString(data /* :string */) {
        let aesCtr = new this.aesjs.ModeOfOperation.ctr(this.key);
        let textBytes = this.aesjs.utils.utf8.toBytes(data);
        let encryptedBytes = aesCtr.encrypt(textBytes);
        return encryptedBytes;
    }
    
    descryptToString(data /* :string */) {
        let aesCtr = new this.aesjs.ModeOfOperation.ctr(this.key);
        let decryptedBytes = aesCtr.decrypt(data);
        return aesCtr.units.fromBytes();
    }
    
    encryptFromNumber(data /* :Number */) {
        let aesCtr = new this.aesjs.ModeOfOperation.ctr(this.key);
        //TODO better way
        let textBytes = this.aesjs.utils.utf8.toBytes(data.toString());
        let encryptedBytes = aesCtr.encrypt(textBytes);
        return encryptedBytes;
    }
    
    descryptToNumber(data /* : */) {
        let aesCtr = new this.aesjs.ModeOfOperation.ctr(this.key);
        let textBytes = this.aesjs.utils.utf8.toBytes(data);
        let encryptedBytes = aesCtr.encrypt(textBytes);
        return Number(encryptedBytes);
    }
}
