'use strict';

class LoginControllerService extends ControllerServiceBase {
    
    constructor() {
        super();
        this.defaultRpcClient = theConfig.defaultRpcClient || "SimpleJsonRpcWebSocketClientService";
    }

    htmlItems = {
        "loginUsername"        : "loginUsername",
        "loginPassword"        : "loginPassword",
        "loginButton"          : "loginButton",
        "loginMessage"         : "loginMessage",
        "loginRpcClientForm"   : "loginRpcClientForm",
        "loginRpcClientRadios" : "loginRpcClientRadios"
    }

    start(body) {
        super.start(body);
        this.createRadios();
        this.addEventListener( this.htmlItems.loginButton, "click", this.login);
        this.addEventListener(this.htmlItems.loginRpcClientForm, "submit", this.login);
    }

    stop() {
        super.stop();
    }
    
    async login(elementName, e, t){
        this.message("Login...");
        console.log("Login...");
        
        let rpcName   = this.checkSelectedRadio();
        let user      = this.getItem(this.htmlItems.loginUsername).value;
        let password  = this.getItem(this.htmlItems.loginPassword).value;
        try {
            await theUserManager.login(user, password, rpcName);
        } catch(e) {
            this.getItem(this.htmlItems.loginPassword).value = "";
            this.error(e.msg);
            console.log(e.toString());
            return;
        }
        thePageLoader.login(user);
        thePageLoader.loadPage("main", undefined, true);
    }
    
    createRadios() {
        let rpcNames = theRpcClients.getNames();
        for(let i in rpcNames) {
            let rpcName         = rpcNames[i];
            let radioDiv        = document.createElement("div");
            let radio           = document.createElement("input");
            let radioSpan       = document.createElement("span");
            radioSpan.innerText = rpcName;
            radio.setAttribute("type", "radio");
            radio.setAttribute("name", "RPCClientNameRadio");
            radio.setAttribute("value", rpcName);
            radioDiv.appendChild(radio);
            radioDiv.appendChild(radioSpan);
            if(rpcName === this.defaultRpcClient) {
                radio.checked = true;
            }
            this.getItem(this.htmlItems.loginRpcClientRadios).appendChild(radioDiv);            
        }
    }

    checkSelectedRadio(){
        let listOfRadio = this.getItem(this.htmlItems.loginRpcClientRadios).getElementsByTagName("input");
        for(let i in listOfRadio) {
            let radio = listOfRadio[i];
            if(radio.checked)
                return radio.value;
        }
    }
}