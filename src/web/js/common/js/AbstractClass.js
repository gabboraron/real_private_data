/**
 * Usage:
 * 
 * class MyAbstractClass1 extends AbstractClass {
 *      static abstractMethods = [
 *          "myMethod1", // (x:string, y:string): string
 *          "myMethod2" // (y:string, z:string): string 
 *      ]
 * }
 *
 * class MyAbstractClass2 extends MyAbstractClass1 {
 *      static abstractMethods = [
 *          "myMethod3", // (x:string, y:string): string
 *          "myMethod4" // (y:string, z:string): string 
 *      ]
 * }
 * 
 * class MyClass extends MyAbstractClass2 {
 *      myMethod1(x, y){return "alma"}
 * }
 * 
 * new MyClass()
 * 
 * AbstractClass.js:23 Uncaught TypeError: Must override the following methods: MyAbstractClass1.myMethod2, MyAbstractClass2.myMethod3, MyAbstractClass2.myMethod4
 *    at new AbstractClass (AbstractClass.js:23)
 *    at new MyAbstractClass1 (AbstractClass.js:28)
 *    at new MyAbstractClass2 (AbstractClass.js:35)
 *    at new MyClass (AbstractClass.js:42)
 *    at AbstractClass.js:46
 *
 */

// https://stackoverflow.com/questions/29480569/does-ecmascript-6-have-a-convention-for-abstract-classes

// TODO: Check at least the number of paramethers

'use strict';
class AbstractClass {
    constructor() {
        if(new.target === AbstractClass || this.__proto__.__proto__.constructor === AbstractClass)
            throw new TypeError("Cannot construct "+ this.constructor.name + " class instances directly");
        let exceptions = {};
        let currProto = this;
        while(currProto.constructor !== AbstractClass ) {
            for(let method of (currProto.constructor.abstractMethods || [])) {
                if("function" !== typeof(this[method]))
                    exceptions[method] = currProto.constructor.name;
            }
            currProto = currProto.__proto__;
        }
        if(0 !== Object.keys(exceptions).length) {
            let exceptionsArray = [];
            for(let method in exceptions) {
                exceptionsArray.push( exceptions[method] + "." + method);
            }
            exceptionsArray.sort();
            throw new TypeError("Must override the following methods: " + exceptionsArray.join(", "));
        }
    }
};