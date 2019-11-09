// https://stackoverflow.com/questions/29480569/does-ecmascript-6-have-a-convention-for-abstract-classes

// TODO: Check at least the number of paramethers
class AbstractClass {
    constructor(abstractMethods /* :string[] */ ) {
        if(new.target === AbstractClass || this.__proto__.__proto__.constructor === AbstractClass)
            throw new TypeError("Cannot construct "+ this.constructor.name + " class instances directly");
        let exceptions = [];
        for(let method of abstractMethods) {
            if("function" !== typeof(this[method]))
                exceptions.push(method);
        }
        if(0 !== exceptions.length)
            throw new TypeError("Must override the following methods: " + exceptions.join(", "));
    }
};

/**
 * Example:
 * 
 * class MyAbstractClass extends AbstractClass {
 *  constructor(){
 *      super([
 *          "myMethod1", // (x:string, y:string): string
 *          "myMethod2" // (y:string, z:string): string
 *          ])
 * }
 * }
 * 
 * class MyClass extends MyAbstractClass {
 *      myMethod1(x, y){return "alma"}
 * }
 * 
 * new MyClass()
 * 
 *   Uncaught TypeError: Must override the following methods: myMethod2
 *   at new AbstractClass (<anonymous>:12:19)
 *   at new MyAbstractClass (<anonymous>:39:11)
 *   at new MyClass (<anonymous>:46:6)
 *   at <anonymous>:50:6
 *
 */