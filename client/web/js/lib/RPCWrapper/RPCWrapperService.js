'use strict';
class RPCWrapperService {
    constructor(){

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
    async login(userhash, passhare) {
        return theRpcClient.call("login",[userhash, passhare]);
    }
}