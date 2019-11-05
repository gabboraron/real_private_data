class SHA256Salty extends IHash {
    
    constructor() {
        super();
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
        //TODO: salt algorithm
        return str;
    }
    
    #postSalt = function(hashArray /* :Array<0..255> */) {
        //TODO: salt algorithm
        return hashArray;
    }
} // end of class SHA256Salty extends HashInterface