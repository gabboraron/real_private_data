from .web_method import web_method
from data_manager.file_manager import FileManager

from error_object.error_object import ErrorObject
from error_object.error_type_enum import ErrorTypeEnum

class RPCWrapper:

    file_manager: FileManager
    def __init__(self, file_manager:FileManager):
        self.file_manager = file_manager
        pass

    
    @web_method("ping")
    def ping(self):
        return "pong"
    

    @web_method("replay")
    def replay(self, message):
        return self.test + message
    

    @web_method(name = "add")
    def add_other_name(self, x: int, y: int) -> int:
        return x + y

    @web_method("login")
    def login(self, userhash, passhare) -> bool:
        if not self.file_manager.is_exist(userhash, passhare):
            raise ErrorObject(ErrorTypeEnum.BAD_USERNAME_PASSWORD)
        return True