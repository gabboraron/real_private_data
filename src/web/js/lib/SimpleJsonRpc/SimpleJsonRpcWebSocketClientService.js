'use strict';
class SimpleJsonRpcWebSocketClientService extends IRPCClient {
    simple_jsonrpc;
    WebSocket;
    jrpc;
    __userHash;
    __passhare;

    constructor(
          ws_url
        , mySimple_jsonrpc = simple_jsonrpc
        , myWebSocket = WebSocket
        ) {
        super();
        if(undefined !== ws_url)
            isInheritedFrom(ws_url, String);
        
        this.simple_jsonrpc = mySimple_jsonrpc;
        this.WebSocket = myWebSocket;
        
        this.ws_protociol = "https:" == window.location.protocol? "wss":"ws"
        this.ws_url = ws_url || this.ws_protociol +"://" + window.location.host + "/ws_rpc"

        this.listeners = {
            error:[],
            open:[],
            close:[]
        }
    } // end of constructor(...)
    
    async start(userHash, passhare) {
        try {
            await this.jrpcInit()
        } catch(e){
            return Promise.reject(e);    
        }
        isInheritedFrom(userHash, String);
        isInheritedFrom(passhare, String);
        this.__userHash = userHash;
        this.__passhare = passhare;
        
        return this.call("login", [this.__userHash, this.__passhare]);
    } // end of start(userHash, passhare)

    async stop() {
        await this.logout();
        return true;
    }

    async logout() {
        this.__userHash = undefined;
        this.__passhare = undefined;
        this.socket.close();
    }
    
    async call(func, args) {
        args = addAuthArgs(args, this.__userHash, this.__passhare);
        return new Promise( (resolve, reject) => {
            this.jrpc.call(func, args).then((d) =>{
                if(!d.error) {
                    resolve(d.data);
                } else {
                    reject( ErrorObject.fromDict(d.error) );
                }
            }).catch( (e) => {
                reject(new ErrorObject(ErrorTypeEnum.LOCAL_CALL_ERROR, e.toString()));
            });
        });
    } // end of call(func, args)

    async jrpcInit() {
        let self = this;
        return new Promise((resolve, reject) =>{
            self.jrpc = new this.simple_jsonrpc();
            try {
                self.socket = new this.WebSocket(this.ws_url);
            } catch(e) {
                reject(ErrorTypeEnum.CONNECTION_ERROR, e.toString());
            }
            self.socket.onopen = (e) => {
                self.notify(IRPCClient.EVENT.open, e)
                resolve(true)
            };
            self.socket.onmessage = function(event) {
                self.jrpc.messageHandler(event.data);
            };
    
            self.jrpc.toStream = function(_msg) {
                self.socket.send(_msg);
            };
    
            self.socket.onerror = function(error) {
                self.notify(IRPCClient.EVENT.error, error)
                let e = new ErrorObject(ErrorTypeEnum.CONNECTION_ERROR, error.message)
                console.debug(e.toString());
                reject(e);
            };
    
            self.socket.onclose = function(event) {
                self.notify(IRPCClient.EVENT.close, event)
                if (event.wasClean) {
                    console.debug('Connection close was clean');
                } else {
                    let e = new ErrorObject(ErrorTypeEnum.CONNECTION_ERROR, 'Connection suddenly close');
                    console.debug(e.toString());
                }
                console.debug('close code : ' + event.code + ' reason: ' + event.reason);
            };
        });
    } // end of async jrpcInit()

    addEventListener(type, listener) {
        this.listeners[type].push(listener)
    }

    removeEventListener(type, listener){
        let listeners = this.listeners[type]
        for(let i = listeners.length - 1; i --> 0;) {
            if( listeners[i] === listener) {
                listeners.splice(i, 1)                
            }
        }
    }

    notify(type, e) {
        let listeners = this.listeners[type]
        for(let i = 0; i < listeners.length; ++i) {
            listeners[i](e)
        }
    }
    
} // end of SimpleJsonRpcWebSocketClient
