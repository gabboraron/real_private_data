from data_manager.file_manager import FileManager
from error_object.error_object import ErrorObject
from error_object.error_type_enum import ErrorTypeEnum
from config import theConfig

from .web_method import web_method

class RPCWrapper:

    file_manager: FileManager
    def __init__(self, file_manager:FileManager):
        self.file_manager = file_manager
        pass

    
    @web_method()
    def login(self, userhash, passhare) -> bool:
        if not self.file_manager.is_exist(userhash, passhare):
            raise ErrorObject(ErrorTypeEnum.BAD_USERNAME_PASSWORD)
        return True

    
    @web_method()
    def create_user(self, new_userhash, new_passhare):
        if not theConfig.enable_create_user:
            raise ErrorObject(ErrorTypeEnum.DISABLED_CREATE_USER)
        self.file_manager.create_user(new_userhash, new_passhare)
    
    
    @web_method()
    def upload_file(self, encryptedName, encryptedContent, is_new, __userhash__, __passhare__):
        return self.file_manager.create_file_byte(__userhash__, __passhare__, encryptedName, encryptedContent, is_new)

    
    @web_method()
    def download_file(self, encryptedName, __userhash__, __passhare__):
        ret = [byte for byte in self.file_manager.open_file(__userhash__, __passhare__, encryptedName)]
        return ret

    
    @web_method()
    def list_dir(self, __userhash__, __passhare__):
        return self.file_manager.list_dir(__userhash__, __passhare__)

    
    #################################

    #TODO: never tested
    @web_method()
    def rename_file(self, old_name, new_name, __userhash__, __passhare__):
        return self.file_manager.rename_file(__userhash__, __passhare__, old_name, new_name )

    #TODO: never tested
    def del_file(self, file_name, __userhash__, __passhare__):
        return self.file_manager.del_file(__userhash__, __passhare__, file_name)
    
    
    #TODO: never tested
    def change_password(self, old_user_hash, old_password_hash, new_user_hash, new_password_hash, files):
        return self.file_manager.change_password(old_user_hash, old_password_hash, new_user_hash, new_password_hash, files)

    #RPC test functions

    @web_method("ping")
    def ping(self):
        return "pong"
    

    @web_method("replay")
    def replay(self, message):
        return message
    

    @web_method(name = "add")
    def add_other_name(self, x: int, y: int) -> int:
        return x + y

