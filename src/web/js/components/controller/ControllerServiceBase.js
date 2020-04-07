'use strict';
class ControllerServiceBase {
    constructor(){
        this.events = []
        this.__initHTMLItems()
    }

    start(body) {
        this.body = body;
        this.addEventListener( this.htmlItems.txtFileBackLink, "click", this.backToMain);
        this.addEventListener( "logoutLink", "click", this.logout);
    }

    stop(){
        this.body = undefined;
    }

    /**
     * 
     * @param {HTMLElement} item 
     * @param {number} [index=0] 
     */
    getItem(item, index){
        if("undefined" === typeof(index)){
            index = 0;
        }
        if("undefined" === typeof(this.body)){
            return undefined
        }
        return this.body.getElementsByClassName(item)[index];
    }

    /**
     * 
     * @param {string} item 
     */
    getEachItems(item) {
        return this.body.getElementsByClassName(item);
    }

    /**
     * 
     * @param {HTMLElement} element 
     * @param {string} eventName
     * @param {function} func 
     */
    addEventListener(elementName, eventType, func){
        let self = this;
        let elements = this.getEachItems(elementName);
        let events = [];
        for(let i = 0; i < elements.length; ++i) {
            let element = elements[i];
            let f = (e) => { 
                if( typeof(e.preventDefault) === "function" && !e.disablePreventDefault)
                    e.preventDefault()
                let ret = func.call(self, elementName, e, this );
                return ret; 
            };
            let event = {
                "element":   element,
                "func":       f,
                "eventType": eventType
            };
            element.addEventListener(eventType, f);
            events.push( event );
        }
        this.events.push( ...events );
        return events;
    }

    stopEachEvents(){
        for(let i = 0; i < this.events.length; ++i ) {
            let event = this.events[i];
            event.element.removeEventListener(event.eventType, event.func);
        }
    }

    backToMain(e, t, f) {
        thePageLoader.loadPage("main", undefined, true);
    }

    logout(e, t, f) {
        thePageLoader.logout();
    }

    /**
     * 
     * @param {*} msg 
     */
    message(msg, ty = "message"){
        console.log(msg.toString())
        let msgDiv = this.getItem("message")
        msgDiv.classList.value = ( ty === "message" )? "message messageOK" : "message messageError"
        msgDiv.innerText = msg.toString()
        this.closeMessageDivWaitStart()
    }

    error(msg) {
        this.message(msg, "error")
    }
    
    closeMessageDivWaitStart() {
        let self = this
        let waitTime = theConfig.hideMessageTime
        this.closeMessageTime = (new Date().getTime()) + waitTime - 200
        setTimeout(() => {self.closeMessageDiv(true)}, waitTime)
    }
    
    closeMessageDiv(wait = false) {
        let currTime = (new Date()).getTime();
        if(wait && currTime < this.closeMessageTime) {
            return
        }
        let msgDiv = this.getItem("message")
        if(typeof(msgDiv) !== "undefined") {
            msgDiv.classList.value = "message hide"
        }
    }
    
    hideElement(element) {
        if(typeof(element) === "string") {
            element = this.getItem(element)
        }
        if("undefined" !== typeof(element)) {
            element.classList.add("hide")
        }
    }
    showElement(element) {
        if(typeof(element) === "string") {
            element = this.getItem(element)
        }
        if("undefined" !== typeof(element)) {
            element.classList.remove("hide")
        }
    }


    __initHTMLItems() {
        let currProto = this
        let htmlItems = {}
        while(currProto.constructor !== ControllerServiceBase) {
            if(currProto.constructor.htmlItems)
                htmlItems = Object.assign({}, htmlItems, currProto.constructor.htmlItems)
            currProto = currProto.__proto__
        }
        this.htmlItems = htmlItems
    }
}
