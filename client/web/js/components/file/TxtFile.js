"use strict";

class TxtFile extends SecretFile {
    constructor() {
        super();
        this.type = "txt";
    }

    start() {
        return super.start();
    }
    
    stop() {
        return super.start();
    }

    /**
     * 
     * @param {string} name 
     */
    setName(name) {
        if( !name.endsWith(".txt")){
            name += ".txt";
        }
        super.setName(name);
        return name;
    }
}