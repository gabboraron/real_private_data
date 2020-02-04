'use strict';
class SimpleJsonRpcPOSTClientService extends IRPCClient {
    simple_jsonrpc;
    jrpc;
    XMLHttpRequest;
    __userHash;
    __passhare;
    
    constructor(
          mySimple_jsonrpc = simple_jsonrpc
        , myXMLHttpRequest = XMLHttpRequest
        ) {
        super();
        let self = this;

        this.simple_jsonrpc = mySimple_jsonrpc;
        this.XMLHttpRequest = myXMLHttpRequest;

        this.jrpc = new this.simple_jsonrpc();
        self.jrpc.toStream = function(_msg) {
            let xhr = new self.XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (this.readyState != 4) return;
                try {
                    JSON.parse(this.responseText);
                    self.jrpc.messageHandler(this.responseText);
                }
                catch(e) {
                    console.error(e);
                }
            };
            xhr.open("POST", '/rpc', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.send(_msg);
        };
    } // end of constructor(...)
    
    async start(userHash, passhare) {
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
} // end of class SimpleJsonRpcPOSTClientService
