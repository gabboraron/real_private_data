from enum import Enum

def _max_len(d):
    return max([len(str(k)) for k in d])


class Enum2(Enum):
    @classmethod
    def maxKeyLen(cls):
        return _max_len(cls.__members__.keys())
    
    @classmethod
    def maxValueLen(cls):
        return _max_len([v.value for v in cls.__members__.values()])
    
    def rjustValue(self):
        return str(self.value).rjust(self.maxValueLen())

    def rjustKey(self):
        return str(self.name).rjust(self.maxKeyLen())

    @classmethod
    def toDictKeyByValue(cls):
        return { v.name:v.value for v in cls.__members__.values() }

    @classmethod
    def toDictValueByKey(cls):
        return {v.value:v.name for v in cls.__members__.values() }
        