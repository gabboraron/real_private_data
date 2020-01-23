'use strict';
class IRPCClient extends AbstractClass {
    static abstractMethods = [
        "call" //(func, args) -> Promise
        //,"authentication", //(userHash:string, userPassword:string)
    ]
    constructor(timer) {
        super();
        console.warn("TODO: Implement");
    }
}