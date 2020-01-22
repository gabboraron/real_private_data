'use strict'

class LoginControllerService {
    /**
     * 
     * @param {HTMLElement} parentDiv 
     */
    constructor(parentDiv) {
        this.parentDiv = parentDiv;
        this.defaultRpcClient = theConfig.defaultRpcClient || "SimpleJsonRpcWebSocketClientService";
    }
    start() {
        let self = this;
        this.html = thePageLoader.loadPage("login", this.parentDiv, true);
        this.usernameInput = this.html.getElementsByClassName("loginUsername")[0];
        this.passwordInput = this.html.getElementsByClassName("loginPassword")[0];
        this.loginButton   = this.html.getElementsByClassName("loginButton")[0];
        this.loginMessage  = this.html.getElementsByClassName("loginMessage")[0];
        this.loginRpcClientForm = this.html.getElementsByClassName("loginRpcClientForm")[0];
        this.createRadios();
        this.loginButton.addEventListener("click", ()=>{self.login()});
    }
    stop() {
        this.html.innerHTML = "";
        this.html          = undefined;
        this.usernameInput = undefined;
        this.passwordInput = undefined;
        this.loginButton   = undefined;
    }
    message(msg) {
        this.loginMessage.innerText = msg;
    }
    async login(){
        this.message("Login...");
        console.log("Login...");
        
        let rpcName   = this.checkSelectedRadio();
        let rpcClient = theRpcClients.getClientByName(rpcName);
        let user      = this.usernameInput.value;
        let password  = this.passwordInput.value;
        let result    = await rpcClient.start(user, password);
        window.result = result;
        if(result.data){
            this.stop();
            (new MainControllerService()).start();
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
            this.loginRpcClientForm.appendChild(radioDiv);            
        }
    }

    checkSelectedRadio(){
        let listOfRadio = this.loginRpcClientForm.getElementsByTagName("input");
        for(let i in listOfRadio) {
            let radio = listOfRadio[i];
            if(radio.checked)
                return radio.value;
        }

    }
}