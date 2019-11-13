'use strict';

//TODO: Better name
function isInheritedFrom(variable, ancestor) {
    if(globalVariables["releaseMode"] !== "debug")
        return true;
    let t = variable;
    while( null !== t && "undefined" !== t.__proto__ && ancestor !== t.constructor)
        t = t.__proto__;
    if( null === t || ancestor !== t.constructor)
        throw TypeError(a.constructor.name + " is not a(n) " + ancestor.name);
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