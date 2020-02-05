from .enum2 import Enum2
from .error_type_enum import ErrorTypeEnum

class ErrorLocEnum(Enum2):
    REMOTE = 1
    LOCAL = 2


class ErrorType():
    ty: ErrorTypeEnum
    loc: ErrorLocEnum
    msg: str
    
    def __init__(self, ty:ErrorTypeEnum, msg:str, loc:ErrorLocEnum = ErrorLocEnum.REMOTE ):
        self.ty = ty
        self.loc = loc
        self.msg = msg
    
    def __str__(self):
        code = self.ty.rjustValue()
        name = self.ty.rjustKey()
        loc = self.loc.rjustKey()
        return "code: {}, name: {}, loc: {}".format(code, name, loc)
    
    def toJson(self):
        return {
            "ty": self.ty.value,
            "loc": self.loc.name,
            "msg": self.msg
        }
