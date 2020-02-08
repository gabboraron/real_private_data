class DirManagerService {
    constructor() {
        this.localFiles = [];
    }

    async start() {

    }

    async stop() {
        for(let i = 0; i <this.localFiles.length; ++i) {
            this.localFiles[i].stop();
        }
        remove(this, "localFiles");
    }
    
    async refreshFileList() {
        this.stop();
        this.localFiles = [];
        let files = await theRpcWrapper.list_dir();
        let encryptor = theEncryptor.fromHexString(theUserManager.__dirHash);
        for(let i = 0; i < files.length; ++i) {
            this.localFiles.push(theFileFactory.createFileFromEncryptedName(files[i], encryptor));    
        }
    }

    async showFiles(refresh = false) {
        if(refresh)
            await this.refreshFileList();

        let files = [];
        for(let i = 0; i < this.localFiles.length; ++i) {
            files.push({
                "encryptedName":this.localFiles[i].__encryptedName,
                "decryptedName":this.localFiles[i].decryptName()
                });
        }
        return files;
    }

    openFile(fNameBytes) {
        let nameEncryptor = theEncryptor.fromHexString(theUserManager.__dirHash);
        let f = theFileFactory.createFileFromEncryptedNameBytes(fNameBytes, nameEncryptor);
        return f;
    }
}