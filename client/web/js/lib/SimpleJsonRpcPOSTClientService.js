class SimpleJsonRpcPOSTClientService extends IClient {
    simple_jsonrpc;
    jrpc;
    XMLHttpRequest;
    #userHash;
    #passhare;
    
    constructor(
          userHash
        , passhare
        , mySimple_jsonrpc = simple_jsonrpc
        , myXMLHttpRequest = XMLHttpRequest
        ) {
        super();
        let self = this;

        isInheritedFrom(userHash,String);
        isInheritedFrom(passhare,String);
        this.#userHash = userHash;
        this.#passhare = passhare;
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
    } // end constructor(...)
    async startAsync(userHash, passhare) {
        let self = this;
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
    async logout() {
        this.#userHash = undefined;
        this.#passhare = undefined;
    }
    async start(userHash, passhare) {
        try {
            return await this.startAsync(userHash, passhare);;
        } catch(e) {
            return e;
        }
    }

    async stopAsyc(){
        await this.logout();
        return new Promise((resolve) =>{ resolve(true) });
    }

    async stop() {
        await this.logout();
        return true;
    }

    async call(func, args) {
        args = addAuthArgs(args, this.#userHash, this.#passhare);
        return this.jrpc.call(func, args);
    } // end of call(func, args)
} // end of class SimpleJsonRpcPOSTClientService