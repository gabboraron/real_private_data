'use strict';

function isInheritedFrom(variable, ancestor, enableUndef) {
    if(!theConfig.debug)
        return true;
    if(typeof(variable) === "undefined"){
        if(enableUndef)
            return true;
        throw TypeError("undefined is not a(n) " + ancestor.name)
    }
    let t = variable;
    while( null !== t && "undefined" !== t.__proto__ && ancestor !== t.constructor)
        t = t.__proto__;
    if( null === t || ancestor !== t.constructor)
        throw TypeError(variable.constructor.name + " is not a(n) " + ancestor.name);
    return true;
}

function byte2hexByte(byte /* :[0-255] */) {
    byte = Number(byte);
    if( !Number.isInteger(byte) )
        throw TypeError("Byte must be convertable to Integer");
    if(byte < 0 || byte > 255)
        throw TypeError("Byte must be between 0 and 255 and " + byte + "is not");
    return (byte<16?"0":"") + byte.toString(16);
}

function hexByteChar2Number(byteChar /* :[00:ff] */) {
    let byte = Number.parseInt(byteChar,16)
    if( !Number.isInteger(byte))
        throw TypeError("ByteStr must be convertable to Integer");
    if(byte < 0 || byte > 255)
        throw TypeError("Byte must be between 0 and 255 and " + byte + "is not");
    return byte;
}

function Uint8Array2String(bytes /* :Uint8Array */) {
    isInheritedFrom(bytes, Uint8Array);
    let ret = "";
    for(let byte of bytes)
        ret += byte2hexByte(byte);
    return ret;
}

function byteStr2Uint8Array(bytesStr /* :striing as Array[00..ff] */) {
    isInheritedFrom(bytesStr, String);
    if(0 !== bytesStr.length % 2)
        throw TypeError("bytesStr length must be even");
    let resBytes = [];
    for(let i = 0; i < bytesStr.length; i +=2)
        resBytes.push(hexByteChar2Number( bytesStr.substr(i, 2)));
    return Uint8Array.from(resBytes);
}

function addAuthArgs(args, userHash, passhare) {
    if(args === undefined)
        args = [];
    if(Array === args.__proto__.constructor) {
        return [userHash, passhare].concat(args);
    }
    else if(Object === args.__proto__.constructor) {
        // Hack for copy object, I don't want to return the passhares
        let o = JSON.parse(JSON.stringify(args));
        o.__userHash__ = userHash;
        o.__pashare__ = passhare;
        return o;
    }
    throw "The args must be Array or Object";
}

/**
 * 
 * @param {Date} date 
 * @param {boolean} [long=false] 
 */
function dateToString(date, long) {
    let addNull = function(x){
        return x<10?("0" + x.toString()):x.toString();
    };
    
    let year  = date.getFullYear().toString();
    let month = addNull(date.getMonth() + 1);
    let day   = addNull(date.getDay());
    
    let hour  = addNull(date.getHours());
    let mins  = addNull(date.getMinutes());
    let secs  = addNull(date.getSeconds());
    let ret = ""
    if(long){
        ret += year+"-"+month+"-"+day+" ";
    }
    return ret + hour+":"+mins+":"+secs;
}

//TODO: not here, better Way
/**
 * 
 * @param {*} self 
 * @param {string} elementName 
 */
function remove(self, elementName){
    if("function" === typeof(self[elementName].stop) ) {
        self[elementName].stop();
    }
    self[elementName] = undefined;
}


/**
 * 
 * @param {string} innerText 
 * @param {function} func 
 */
function createLink(innerText, func) {
    let link = document.createElement("a")
    link.href = "#"
    link.innerText = innerText
    link.addEventListener("click", (e) =>{
        e.preventDefault()
        func(e)
    })
    return link
}

/**
 * 
 * @param {string} value 
 * @param {function} func 
 * @param {string} type 
 */
function createButton(value, func, type = "button") {
    let button = document.createElement("input")
    button.type = type
    button.value = value
    button.classList.add("btn")
    button.classList.add("btn-secondary")
    button.classList.add("btn-sm")
    button.addEventListener("click", (e) =>{
        if("submit" !== type) {
            e.preventDefault()
        }
        func(e)
    })
    return button
}

/**
 * 
 * @param {string} a 
 * @param {string} b 
 */
function insensitiveCompare(a, b) {
    //TODO: Hungarian abc
    let aLow = a.toLowerCase()
    let bLow = b.toLowerCase()
    return aLow < bLow ? -1 :
           aLow > bLow ?  1 : 0
}