'use strict';

class UserManagerService extends IUserManagerService { 
    constructor() {
        super();
        this.__username  = null;
        this.__loginHash = null;
        this.__dirHash   = null;
        this.__logedIn   = false;
        this.__rpcClient = null;
    }

    start() {
    }

    stop() {
        this.logout();
    }

    /**
     * 
     * @param {string} plainUsername 
     * @param {string} plainPassword
     */
    async login(plainUsername, plainPassword, rpcName) {
        if(this.__logedIn){
            return Promise.reject(new ErrorObject(ErrorTypeEnum.ALREADY_LOGEDIN));
        }
        
        this.__username  = this.__hash(plainUsername);
        this.__loginHash = this.__hash(plainPassword);
        this.__dirHash   = this.__hash(plainPassword + plainPassword);
        this.__rpcClient = theRpcClients.getClientByName(rpcName);
        await this.__rpcClient.start(this.__username, this.__loginHash);
        this.__logedIn = true;
        return true;
    }

    logout() {
        console.log("Logout")
        this.__username  = undefined;
        this.__loginHash = undefined;
        this.__dirHash   = undefined;
        this.__logedIn   = false;
        this.__rpcClient.stop();
        this.__rpcClient = undefined;
        
    }

    /**
     * 
     * @param {string} plainUsername 
     * @param {string} plainPassword 
     */
    async createUser(plainUsername, plainPassword) {
        let userHash = this.__hash(plainUsername);
        let passhare = this.__hash(plainPassword);
        return await theRpcWrapper.create_user(userHash, passhare);
    }

    /**
     * 
     * @param {*} userHash 
     */
    deleteUserByUserHash(userHash) {
        console.debug("TODO:Implement");
    }

    /**
     * 
     * @param {string} oldPlainPassword 
     * @param {string} newPlainPassword 
     */
    async chgPassword(oldPlainPassword, newPlainPassword ) {
        let oldPasshare = this.__hash(oldPlainPassword);
        let newPasshare = this.__hash(newPlainPassword);
        let oldDirHash = this.__hash(oldPlainPassword + oldPlainPassword)
        let newDirHash = this.__hash(newPlainPassword + newPlainPassword)
        let files = await theRpcWrapper.list_dir()
        let newFiles = this.__renameFiles(oldDirHash, newDirHash, files)
        await theRpcWrapper.change_password(
            this.__username,
            oldPasshare,
            this.__username,
            newPasshare,
            newFiles
            )
    }

    /**
     * 
     * @param {string} oldDirPass hex
     * @param {string} newDirPass hex
     * @param {Array} files 
     */
    __renameFiles(oldDirPass, newDirPass, files){
        let newFiles = []
        let oldEncryptor = theEncryptor.fromHexString(oldDirPass)
        let newEncryptor = theEncryptor.fromHexString(newDirPass)
        for(let i = 0; i < files.length; ++i) {
            let oldFileEncryptedName = files[i]
            let oldFile = theFileFactory.createFileFromEncryptedName(oldFileEncryptedName, oldEncryptor)
            let decryptedName = oldFile.decryptName()
            let encryptedNameBytes = newEncryptor.encryptFromString(decryptedName)
            let hexName = Uint8Array2String(encryptedNameBytes)
            newFiles.push({
                old:oldFileEncryptedName,
                new:hexName
            })
        }
        return newFiles
    }

    getUserName() {
        console.debug("TODO:Implement");
    }

    getLoginHash() {
        console.debug("TODO:Implement");
    }

    getDirHash() {
        console.debug("TODO:Implement");
    }

    /**
     * 
     * @param {string} str 
     */
    __hash(str){
        return theHash.string(str);
    }
};