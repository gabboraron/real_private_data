#from typing import TypeVar as _TypeVar, Generic as _Generic
import typing

_T = typing.TypeVar('_T', bool, int, str, float)

class Arg(typing.Generic[_T]):
    value:_T
    help:str = ""
    default_value:_T
    is_optional:bool = True
    is_public:bool = False

    def __init__(self,
        help:str = "",
        default_value:_T = None,
        is_optional:bool = True,
        is_public:bool = False
        ):
        self.value = default_value
        self.help = help
        self.default_value = default_value
        self.is_optional = is_optional
        self.is_public = is_public


    def __get__(self, instance, owner, prepare = False):
        return self if prepare else self.value

    @staticmethod
    def get(cls, attrStr:str):
        return cls.__dict__[attrStr]

class IntArg(Arg[int]):
    t = int

class BoolArg(Arg[bool]):
    t = bool

class FloatArg(Arg[float]):
    t = float

class StrArg(Arg[str]):
    t = str