'use strict';
class IRPCClient extends AbstractClass {
    abstractMethods = [
        "call" //(func, args) -> Promise
        //,"authentication", //(userHash:string, userPassword:string)
    ]
    constructor(timer) {
        super();
        console.warn("TODO: Implement");
    }
}

IRPCClient.EVENT = {
    open:  "open",
    close: "close",
    error: "error"
}