"use strict";

window.fileTypes = {
    "txt":"txt"
}

class FileFactory {
    static types = {
        "txt" : TxtFile
    };

    static createFile = function(type) {
        return new this.types[type]();
    }

    static createFileFromEncryptedNameBytes(nameBytes, nameEncryptor) {
        let plainName = nameEncryptor.descryptToString(nameBytes);
        let type = plainName.match(/[.]([^.]+)$/)[1];
        let f = this.createFile(type);
        f.setNameEncryptor(nameEncryptor);
        f.setName(plainName);
        return f;  
    }

    static createFileFromEncryptedName(name, nameEncryptor) {
        let nameBytes = byteStr2Uint8Array(name);
        return this.createFileFromEncryptedNameBytes(nameBytes, nameEncryptor);
    }

}