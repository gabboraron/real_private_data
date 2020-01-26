class ErrorObject {

    /**
     * 
     * @param {ErrorTypeEnum} ty 
     * @param {string|undefined} data 
     * @param {int} [date=new Date()] UTC in sec 
     */
    constructor(ty, data, date) {
        this.ty = ty;
        this.data = data;
        if("undefined" !== typeof(date)){
            this.date = new Date(date*1000);
        } else {
            this.date = new Date();
        }
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