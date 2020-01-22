'use strict';

class IEncryptor extends AbstractClass {
    abstractMethods = [
        "encryptFromString", //(data:string): any
        "descryptToString", //(data:any) /* -> string */
        "encryptFromNumber", //(data: Number ) /* -> any */
        "descryptToNumber" //(data: any) /* -> Number */ 
    ];
}
