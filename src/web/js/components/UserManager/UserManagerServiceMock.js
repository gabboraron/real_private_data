'use strict';

class UserManagerServiceMock extends IUserManagerService { 
    constructor() {
        super();
        this.__username  = null;
        this.__loginHash = null;
        this.__dirHash   = null;
        this.__logedIn   = false;
        this.__rpcClient = null;
    }

    start() {
        console.debug("TODO:Implement");
    }

    stop() {
        this.logout();
    }

    /**
     * 
     * @param {string} plainUsername 
     * @param {string} plainPassword 
     */
    async login(plainUsername, plainPassword, rpcClientServiceName) {
        if(this.__logedIn){
            return Promise.reject(new ErrorObject(ErrorTypeEnum.ALREADY_LOGEDIN));
        }
        if( plainUsername === "bad" && plainPassword === "bad" ) {
            return Promise.reject(new ErrorObject(ErrorTypeEnum.BAD_USERNAME_PASSWORD));
        }
        // let rpcClient = theRpcClients.getClientByName(rpcName);
        this.__username  = plainUsername;
        this.__loginHash = plainPassword;
        this.__dirHash   = plainPassword;
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
    createUser(plainUsername, plainPassword) {
        console.debug("TODO:Implement");
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
     * @param {*} username 
     * @param {*} old_password 
     * @param {*} new_password 
     */
    chgPassword(username, old_password, new_password ) {
        console.debug("TODO:Implement");
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
};