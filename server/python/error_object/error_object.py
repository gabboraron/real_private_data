import time

from .error_type_enum import ErrorTypeEnum
from .error_types import ErrorTypes

class ErrorObject(Exception):
    ty:ErrorTypeEnum
    data:str
    timestamp:int
    
    def __init__(self, ty:ErrorTypeEnum, data:str = None, timestamp = None):
        self.ty = ty
        self.data = data
        self.timestamp = timestamp or time.time()
    
    def toJson(self):
        return {
            "code": self.ty.value,
            "data": self.data,
            "timestamp":self.timestamp
        }
    
    def getMsg(self):
        return ErrorTypes[self.ty].msg
    
    def __str__(self):
        data = "data: {}".format(self.data) if self.data else ""
        return "Error:{} {}".format(self.getMsg(), data)