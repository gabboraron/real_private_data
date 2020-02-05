"use strict";

window.fileTypes = {
    "txt":"txt"
}

class FileFactory {
    types = {
        "txt" : TxtFile
    };

    createFile = function(type) {
        return new this.types[type]();
    }

    createFileFromEncryptedNameBytes(nameBytes, nameEncryptor) {
        let plainName = nameEncryptor.decryptToString(nameBytes);
        let type = plainName.match(/[.]([^.]+)$/)[1];
        let f = this.createFile(type);
        f.setNameEncryptor(nameEncryptor);
        f.setName(plainName);
        return f;  
    }

    createFileFromEncryptedName(name, nameEncryptor) {
        let nameBytes = byteStr2Uint8Array(name);
        return this.createFileFromEncryptedNameBytes(nameBytes, nameEncryptor);
    }

}