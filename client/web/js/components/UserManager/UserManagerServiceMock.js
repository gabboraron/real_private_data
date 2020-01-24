'use strict';

class UserManagerServiceMock extends IUserManagerService { 
    constructor() {
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
    async login(plainUsername, plainPassword, rpcClientService) {
        if(this.__logedIn){
            let error = { 
                "data":undefined, 
                "error":{
                    "code": 9,
                    "message":"You are already loged in"
                }
            }
            console.warn(error);
            return error;
        }
        if( plainUsername === "bad" && plainPassword === "bad" ) {
            return { 
                "data":undefined, 
                "error":{
                    "code": 2, 
                    "message":"Bad username and/or password"
                }
            };
        }
        console.log("Loged in");
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