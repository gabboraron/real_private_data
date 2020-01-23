'use strict'
class ControllerServiceBase {
    constructor(){
        this.events = [];
    }

    start(body){
        this.body = body;
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
            let f = (e) => { return func.call(self, elementName, e, this ); };
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
}