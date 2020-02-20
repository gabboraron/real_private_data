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
    message(msg){
        console.log(msg.toString())
        this.getItem("message").innerText = msg.toString()
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
