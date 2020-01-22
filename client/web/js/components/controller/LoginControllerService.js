'use strict'

class LoginControllerService {
    /**
     * 
     * @param {HTMLElement} parentDiv 
     */
    constructor(parentDiv) {
        this.parentDiv = parentDiv;
    }
    start() {
        let self = this;
        this.html = thePageLoader.loadPage("login", this.parentDiv, true);
        this.usernameInput = this.html.getElementsByClassName("loginUsername")[0];
        this.passwordInput = this.html.getElementsByClassName("loginPassword")[0];
        this.loginButton   = this.html.getElementsByClassName("loginButton")[0];
        this.loginMessage  = this.html.getElementsByClassName("loginMessage")[0];
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
    login(){
        this.message("Login...");
        console.log("Login...");
        this.stop();
    }
}