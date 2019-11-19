class SimpleJsonRpcWebSocketClient extends IClient {
    simple_jsonrpc;
    WebSocket;
    jrpc;
    #userHash;
    #passhare;
    
    constructor(
          userHash
        , passhare
        , ws_url
        , mySimple_jsonrpc = simple_jsonrpc
        , myWebSocket = WebSocket
        ) {
        super();
        let self = this;
        isInheritedFrom(userHash, String);
        isInheritedFrom(passhare, String);
        if(undefined !== ws_url)
            isInheritedFrom(ws_url, String);
        
        this.#userHash = userHash;
        this.#passhare = passhare;
        this.simple_jsonrpc = mySimple_jsonrpc;
        this.WebSocket = myWebSocket;
        
        this.ws_protociol = "https:" == window.location.protocol? "wss":"ws"
        this.ws_url = ws_url || this.ws_protociol +"://" + window.location.host + "/ws_rpc"
        this.jrpc = new this.simple_jsonrpc();
        this.socket = new this.WebSocket(this.ws_url);

        this.socket.onmessage = function(event) {
            console.log("data");
            self.jrpc.messageHandler(event.data);
        };

        this.jrpc.toStream = function(_msg) {
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

    } // end of constructor(...)
    
    _prepare_args(args) {
        if(Array === x.__proto__.constructor) {
            return [this.#userHash, this.#passhare].concat(args);
        }
        else if(Object === x.__proto__.constructor){
            // Hack for copy object, I don't want to return the passhares
            let o = JSON.parse(JSON.stringify(args));
            o.__userHash__ = this.#userHash;
            o.__pashare__ = this.#passhare;
            return o;
        }
        throw "The args must be Array or Object"
    }
    async call(func, args) {
        return this.jrpc.call(func, args);
    } // end of call(func, args)
} // end of SimpleJsonRpcWebSocketClient