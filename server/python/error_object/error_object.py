import time

from .error_type_enum import ErrorTypeEnum


class ErrorObject():
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