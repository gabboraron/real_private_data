BigInt.ToJSonTypes = {
    "TO_NUMBER": "TO_NUMBER",
    "TO_STRING": "TO_STRING",
    "TO_STRING_WITH_N": "TO_STRING_WITH_N"
}
Object.freeze(BigInt.ToJSonTypes);

BigInt.TOJSonType = BigInt.TOJSonType || BigInt.ToJSonTypes.TO_NUMBER;

switch(BigInt.ToJSonType)
{
    case BigInt.ToJSonType === BigInt.ToJSonTypes.TO_STRING:
        BigInt.prototype.toJSON = function()
        {
            return this.toString();
        }
        break;
    case BigInt.ToJSonType === BigInt.ToJSonTypes.TO_STRING_WITH_N:
        BigInt.prototype.toJSON = function()
        {
            return this.toString() + "n";
        }
        break;
    case BigInt.ToJSonTypes.TO_NUMBER:
        BigInt.prototype.toJSON = function()
        {
            if(this > Number.MAX_SAFE_INTEGER || this < Number.MIN_SAFE_INTEGER )
            {
                console.error("Cannot convert " + this + " to toJSON because this is  bigger than MAX_SAFE_INTEGER or smaller than MIN_SAFE_INTEGER");
                return Number.NaN;
            }
            return Number(this);
        }
        break;
    default:
        console.log("Not known BigInt.ToJSonType:" + BigInt.TOJSonType );
} // end of switch(BigInt.ToJSonType)