'use strict';
class SimpleJsonRpcWebSocketClientService extends IRPCClient {
    simple_jsonrpc;
    WebSocket;
    jrpc;
    #userHash;
    #passhare;
    
    constructor(
          ws_url
        , mySimple_jsonrpc = simple_jsonrpc
        , myWebSocket = WebSocket
        ) {
        super();
        let self = this;
        if(undefined !== ws_url)
            isInheritedFrom(ws_url, String);
        
        this.simple_jsonrpc = mySimple_jsonrpc;
        this.WebSocket = myWebSocket;
        
        this.ws_protociol = "https:" == window.location.protocol? "wss":"ws"
        this.ws_url = ws_url || this.ws_protociol +"://" + window.location.host + "/ws_rpc"
    } // end of constructor(...)
    
    async logout() {
        this.#userHash = undefined;
        this.#passhare = undefined;
        this.socket.close();
    }
    
    async jrpcInit() {
        let self = this;
        return new Promise((resolve) =>{
            self.jrpc = new this.simple_jsonrpc();
            self.socket = new this.WebSocket(this.ws_url);
            self.socket.onopen = () =>{ resolve(true)};
            self.socket.onmessage = function(event) {
                console.log("data");
                self.jrpc.messageHandler(event.data);
            };
    
            self.jrpc.toStream = function(_msg) {
                self.socket.send(_msg);
            };
    
            self.socket.onerror = function(error) {
                console.error("Error: " + error.message);
            };
    
            self.socket.onclose = function(event) {
                if (event.wasClean) {
                    console.info('Connection close was clean');
                } else {
                    console.error('Connection suddenly close');
                }
                console.info('close code : ' + event.code + ' reason: ' + event.reason);
            };
        });
    }
    async startAsync(userHash, passhare) {
        let self = this;
        if(!await self.jrpcInit())
            return {data: undefined, error:"Cannot connect"};
        if(undefined !== userHash) {
            isInheritedFrom(userHash, String);
            this.#userHash = userHash;
        }
        if(undefined !== passhare) {
            isInheritedFrom(passhare, String);
            this.#passhare = passhare;
        }
        
        return new Promise( (resolve, reject) =>{
            self.jrpc.call("login", [self.#userHash, self.#passhare, self.#userHash, self.#passhare])
                .then((data) => {
                    if(data.data)
                        resolve(data);
                    else
                        reject(data);
                }).catch((reason) =>{
                    reject(reason);
                })
        });
    } // end of start(userHash, passhare)
    async start(userHash, passhare) {
        try {
            return await this.startAsync(userHash, passhare);;
        } catch(e) {
            return e;
        }
    }

    async stopAsyc(){
        
        return new Promise((resolve) =>{ resolve(true) });
    }

    async stop() {
        return true;
    }
    async call(func, args) {
        args = addAuthArgs(args, this.#userHash, this.#passhare);
        return this.jrpc.call(func, args);
    } // end of call(func, args)
} // end of SimpleJsonRpcWebSocketClient