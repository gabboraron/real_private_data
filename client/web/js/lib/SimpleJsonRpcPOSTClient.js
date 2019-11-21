class SimpleJsonRpcPOSTClient extends IClient {
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

        //isInheritedFrom(userHash,?);
        //isInheritedFrom(passhare,?);
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
    
    async call(func, args) {
        args = addAuthArgs(args, this.#userHash, this.#passhare);
        return this.jrpc.call(func, args);
    } // end of call(func, args)
} // end of class SimpleJsonRpcPOSTClient