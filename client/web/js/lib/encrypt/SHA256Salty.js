class SHA256Salty extends IHash {
    #saltSentence;
    #sha256;

    constructor(saltSentence = "My own secret sentence for salt", mySha256 = sha256) {
        super();
        this.#saltSentence = saltSentence;
        this.#sha256 = mySha256;
    }

    string(str /* :string */) /* :string */ {
        isInheritedFrom(str, String);
        let hashArray = this.array(str);
        let res = ""
        for(let i = 0; i< hashArray.length; ++i) {
            if(hashArray[i] < 16)
                res += "0";
            res += hashArray[i].toString(16);
        }
        return res;
    }
    
    array(str /* :string */) /* :number[] */ {
        return this.postSalt(this.#sha256.array(this.preSalt(str)));
    }

    preSalt(str /* :string */) {
        let res = "";
        for(let i = 0; i < str.length; ++i) {
            let saltChar = this.#saltSentence[i % this.#saltSentence.length] || "\0"; // incase if this.saltSentence is empty
            res += String.fromCharCode((str.charCodeAt(i) + i * saltChar.charCodeAt(0) ) % 256) 
            res += saltChar;
        }
        return res;
    }
    
    postSalt(hashArray /* :Array<0..255> */) /* :Array<0..255> */ {
        //TODO: salt algorithm
        // I'm not sure, if I make a post salt algorithm, it will decrease the
        // SHA crash or not, so I don't do that
        return hashArray;
    }
} // end of class SHA256Salty extends HashInterface

// TODO better name
class SHA256Salty2 extends SHA256Salty {
    constructor(mySha256) {
        super("", mySha256);
    }
    
    preSalt(str /* :string */) /* :string */ {
        let res = "";
        for(let i = 0; i < str.length; ++i) {
            let saltChar = str[str.length -1 - i];
            res += String.fromCharCode((str.charCodeAt(i) + i * saltChar.charCodeAt(0) ) % 256) 
            res += saltChar;
        }
        return res;
    }
} // end of class SHA256Salty2 extends SHA256Salty