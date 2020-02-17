class ErrorObject {

    /**
     * 
     * @param {ErrorTypeEnum} ty 
     * @param {string|undefined} data 
     * @param {int} [date=new Date()] UTC in sec 
     */
    constructor(ty, data, date) {
        if("undefined" !== typeof(date)){
            this.date = new Date(date*1000);
        } else {
            this.date = new Date();
        }
        if(typeof(ErrorTypes[ty]) === "undefined" ) {
            this.msg = ty
            if(theConfig.debug) {
                console.warn("TODO: Create error_object for " + this.msg)
            }
            return;
        }
        this.ty = ty;
        this.data = data;
        this.name = ErrorTypeEnumByValue[ty]
        this.msg = ErrorTypes[ty].msg;
        this.loc = ErrorTypes[ty].loc;
    }

    toString() {
        let dateStr = dateToString(this.date);
        let data = (!this.data)?"":(", data: " + this.data)
        return "Error: " + dateStr + ", " 
            + this.loc + ", " + this.ty + ", " + this.name + ", msg: " + this.msg + data;
    }
} // end of ErrorObject

ErrorObject.fromDict = function(obj) {
    return new ErrorObject(obj.code, obj.data, obj.timestamp);
}