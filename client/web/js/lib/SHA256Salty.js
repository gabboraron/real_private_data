class SHA256Salty extends IHash {
    #saltSentence;
        
    constructor(saltSentence = "My own secret sentence for salt") {
        super();
        this.#saltSentence = saltSentence;
    }

    string = function(str /* :string */) {
        let hashArray = this.array(str);
        let res = ""
        for(let i = 0; i< hashArray.length; ++i)
        {
            if(hashArray[i] < 16)
                res += "0";
                res += hashArray[i].toString(16);
        }
        return res;
    }
    
    array = function(str /* :string */) {
        return this.postSalt(sha256.array(this.#preSalt(str)));
    }

    #preSalt = function(str /* :string */) {
        let res = "";
        for(let i = 0; i < str.length; ++i)
        {
            let saltChar = this.#saltSentence[i % this.#saltSentence.length];
            res += String.fromCharCode((str[i].charCodeAt() + i * saltChar.charCodeAt() ) % 256) 
            res += saltChar;
        }
        return res;
    }
    
    #postSalt = function(hashArray /* :Array<0..255> */) {
        //TODO: salt algorithm
        // I'm not sure, if I make a post salt algorithm, it will decrease the
        // SHA crash or not, so I don't do that
        return hashArray;
    }
} // end of class SHA256Salty extends HashInterface