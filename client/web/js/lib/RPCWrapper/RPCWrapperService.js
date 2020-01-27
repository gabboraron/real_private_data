'use strict';
class RPCWrapperService {
    constructor(){

    }
    
    /**
     * 
     * @param {string} userhash sha256 string
     * @param {string} passhare sha256 string
     */
    async create_user(userhash, passhare) {
        return theRpcClient.call("create_user", [userhash, passhare])
    }
    
    async login(userhash, passhare) {
        return theRpcClient.call("login",[userhash, passhare]);
    }

    async ping() {
        return theRpcClient.call("ping");
    }
    
    async replay(message) {
        return theRpcClient.call("message", [message]);
    }
    
    async add(x, y) {
        return theRpcClient.call("add",[x,y]);
    }
}