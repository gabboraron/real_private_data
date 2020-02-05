"use strict";

class SecretFile //extends ISecretFile 
{
    __encryptedName;
    __encryptedContent;
    __contentEncryptor;
    __nameEncryptor;

    constructor() {

    }

    start() {

    }

    stop() {
        remove(this, "__encryptedName");
        remove(this, "__encryptedContent");
        remove(this, "__contentEncryptor");
        remove(this, "__nameEncryptor");
    }
    
    /**
     * 
     * @param {IEncryptor} contentEncryptor 
     */
    setContentEncryptor(contentEncryptor, check = false) {
        isInheritedFrom(contentEncryptor, IEncryptor);
        if(this.__contentEncryptor !== undefined) {
            throw "use changeContentEncryptor instead of setContentEncryptor";
        }
        this.__contentEncryptor = contentEncryptor;
        if(check){
            try {
                this.descript();
            } catch(e) {
                this.__contentEncryptor = undefined;
                throw e;
            }
        }
    }
    
    changeContentEncryptor(newEncryptor, oldEncryptor) {
        if(typeof(oldEncryptor) === undefined) {
            oldEncryptor = this.__contentEncryptor;
        }
        let currEncryptor = this.__contentEncryptor;
        this.__contentEncryptor = oldEncryptor;
        try {
            let text = this.descript().txt;
            this.__contentEncryptor = newEncryptor;
            this.encrypt(text);
        } catch(e){
            this.__contentEncryptor = currEncryptor;
            throw e;
        }
    }

    /**
     * 
     * @param {string} plainPassword 
     */
    setPassword(plainPassword, check) {
        return this.setContentEncryptor(theEncryptor.fromString(plainPassword), check);
    }

    /**
     * 
     * @param {string} oldPlainPassword 
     * @param {string} newPlainPassword 
     */
    chgPassword(newPlainPassword, oldPlainPassword) {
        let newEncryptor = theEncryptor.fromString(newPlainPassword);
        let oldEncryptor = undefined;
        if(oldPlainPassword)
            oldEncryptor = theEncryptor.fromString(oldPlainPassword);
        return this.changeContentEncryptor(newEncryptor, oldEncryptor);
    }

    /**
     * 
     * @param {IEncryptor} nameEncryptor 
     */
    setNameEncryptor(nameEncryptor) {
        isInheritedFrom(nameEncryptor, IEncryptor);
        this.__nameEncryptor = nameEncryptor;
    }
    
    /**
     * 
     * @param {string} name 
     */
    setName(name) {
        this.__encryptedName = this.__nameEncryptor.encryptFromString(name);
    }

    /**
     * 
     * @param {string} name 
     * @param {bool} [upload=true] 
     */
    async rename(name, upload = true) {
        let oldName = this.__encryptedName;
        let newName = this.__nameEncryptor.encryptFromString(name);
        await theRpcWrapper.rename_file(oldName, newName);
        this.__encryptedName = newName;
        return true;
    }
    
    descryptName() {
        return this.__nameEncryptor.descryptToString(this.__encryptedName);
    }
    
    /**
     * 
     * @param {string} content 
     */
    encrypt(content) {
        let now = ((new Date()).getTime()/1000).toString();
        let txt = now + "|" +  content;
        this.__encryptedContent = this.__contentEncryptor.encryptFromString(txt);
    }
    
    descript() {
        let rawDescrypted = this.__contentEncryptor.descryptToString(this.__encryptedContent);
        let sep  = rawDescrypted.indexOf("|");
        let timestampSec = Number(rawDescrypted.substr(0,sep));
        return {
            "modifyDate" : new Date(timestampSec*1000),
            "txt" : rawDescrypted.substr(sep+1)
        };
    }
    
    toJson() {
        let ret = {
            "name": Uint8Array2String(this.__encryptedName),
            "content": Uint8Array2String(this.__encryptedContent)
        }
        if(this.__oldName) {
            ret["oldName"] = this.__oldName;
        }
        return ret;
    }

    /**
     * 
     * @param {boolean} [isNew=false] 
     */
    async upload(isNew = false) {
        return theRpcWrapper.upload_file(Uint8Array2String(this.__encryptedName), Array.from(this.__encryptedContent), isNew);
    }

    async download() {
        let bytes = await theRpcWrapper.download_file(Uint8Array2String(this.__encryptedName));
        this.__encryptedContent = new Uint8Array( bytes);
        return true;
    }

    async del_file() {
        return theRpcWrapper.del_file(this.__encryptedName);
    }
};

// todo not here
async function testSecretFile() {
    var key1 = sha256("alma");
    var key2 = sha256("alma2");
    var e1 = AESEncryptor.fromHexString(key1);
    var e2 = AESEncryptor.fromHexString(key2);
    
    var data = "asd;fjkl;fjkls;jklafs;kladf;klg;jlfdsljkfgkldfa;jkldfg;g;jljkladfjkldfgjkladfjkladf;jklfd;jklsdjkjklfdsklasdf;jklafdjadfj;lgladfj;ldgjkadhlaf;lsfjksaslalakkal nem illik aludni, mert a salak ay salak\
    affsdlafdklkadfjd;ad;kljklsdf;jkladf;jkladfjklfsd;jkl;jklsdfadf;klaf;jklaf;jlghadjlsdfjkldf;jkldf;kld;fjklsdfjkl";
    var name = "a";

    var sf = new SecretFile();
    sf.setContentEncryptor(e1);
    sf.setNameEncryptor(e2);

    sf.encrypt(data);
    sf.setName(name);

    let descrypted = sf.descript();
    console.log(descrypted);
    console.log(sf.__encryptedContent);

    console.log(sf.toJson());
}

async function testUpdateSecretFile() {
    var key1 = sha256("alma");
    var e1 = AESEncryptor.fromHexString(key1);
    var e2 = AESEncryptor.fromHexString(theUserManager.__dirHash);
    var sf = new SecretFile();
    
    sf.setContentEncryptor(e1);
    sf.setNameEncryptor(e2);

    sf.setName("Ez a fajlom neve.txt");
    var data = "alfdladf;lasdf;ldg adga;lhkdfgjkldfgdfgs asdfsd;fjkladfklg\
    fajsdfkakldfjkladfjklfadjkladf;jkladfjkl;jkladfg;jkldfg\
    fsdalj;dfjkladf;jkld;fjldfasjljkldfjla;gldhdfjsdf";
    sf.encrypt(data);
    await sf.upload(false);
    await sf.download();
    var c = sf.descript();
    if(c.txt === data){
        console.log("ok", c.modifyDate)
    }

};