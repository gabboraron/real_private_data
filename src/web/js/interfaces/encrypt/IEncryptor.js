'use strict';

class IEncryptor extends AbstractClass {
    abstractMethods = [
        "encryptFromString", //(data:string): any
        "decryptToString", //(data:any) /* -> string */
        "encryptFromNumber", //(data: Number ) /* -> any */
        "decryptToNumber" //(data: any) /* -> Number */ 
    ];
}
