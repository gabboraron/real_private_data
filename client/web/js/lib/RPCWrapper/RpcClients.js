'use strict'
class RpcClients {
    constructor() {
        this.clientNames = {
            "SimpleJsonRpcWebSocketClientService": "SimpleJsonRpcWebSocketClientService",
            "SimpleJsonRpcPOSTClientService":      "SimpleJsonRpcPOSTClientService"
        }
        this.clients = {
            "SimpleJsonRpcWebSocketClientService" : new SimpleJsonRpcWebSocketClientService(),
            "SimpleJsonRpcPOSTClientService"      : new SimpleJsonRpcPOSTClientService()
        }
    }

    getClientByName(name) {
        window.theRpcClient = this.clients[name];
        return window.theRpcClient;
    }
    getNames(){
        return Object.keys(this.clients);
    }
}
document.addEventListener("load",() => {
    console.log("alma");
    window.theRpcClients = new RpcClients();
});

window.theRpcClients = new RpcClients();