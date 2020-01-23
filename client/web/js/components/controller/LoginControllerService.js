'use strict'

class LoginControllerService extends ControllerServiceBase {
    
    constructor() {
        super();
        this.defaultRpcClient = theConfig.defaultRpcClient || "SimpleJsonRpcWebSocketClientService";
    }

    htmlItems = {
        "loginUsername":"loginUsername",
        "loginPassword":"loginPassword",
        "loginButton":"loginButton",
        "loginMessage":"loginMessage",
        "loginRpcClientForm":"loginRpcClientForm"
    }

    start(body) {
        super.start(body);
        this.createRadios();
        this.addEventListener( this.htmlItems.loginButton, "click", this.login);
    }

    stop() {
        super.stop();
    }
    
    message(msg) {
        this.getItem(this.htmlItems.loginMessage).innerText = msg;
    }
    
    async login(){
        this.message("Login...");
        console.log("Login...");
        
        let rpcName   = this.checkSelectedRadio();
        let rpcClient = theRpcClients.getClientByName(rpcName);
        let user      = this.getItem(this.htmlItems.loginUsername).value;
        let password  = this.getItem(this.htmlItems.loginPassword).value;
        let result    = await rpcClient.start(user, password);
        window.result = result;
        if(result.data){
            this.stop();
            thePageLoader.loadPage("main", undefined, true);
        } else {
            this.message(result.error.message);
            console.log("code", result.error.code, "message", result.error.message);
        }
    }
    createRadios() {
        let rpcNames = theRpcClients.getNames();
        for(let i in rpcNames) {
            let rpcName = rpcNames[i];
            let radioDiv = document.createElement("div");
            let radio = document.createElement("input");
            let radioSpan = document.createElement("span");
            radio.setAttribute("type", "radio");
            radio.setAttribute("name", "RPCClientNameRadio");
            radio.setAttribute("value", rpcName);
            if(rpcName === this.defaultRpcClient) {
                radio.checked = true;
            }
            radioSpan.innerText = rpcName;
            radioDiv.appendChild(radio);
            radioDiv.appendChild(radioSpan);
            this.getItem(this.htmlItems.loginRpcClientForm).appendChild(radioDiv);            
        }
    }

    checkSelectedRadio(){
        let listOfRadio = this.getItem(this.htmlItems.loginRpcClientForm).getElementsByTagName("input");
        for(let i in listOfRadio) {
            let radio = listOfRadio[i];
            if(radio.checked)
                return radio.value;
        }
    }
}