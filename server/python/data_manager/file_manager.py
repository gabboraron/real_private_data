#!/usr/bin/env python3

import sys
from config import theConfig
from sha256Salty.sha256Salty import SHA256Salty
from error_object.error_object import ErrorObject
from error_object.error_type_enum import ErrorTypeEnum

if sys.version_info.major != 3:
    print("please use python3")

import os

class FileManager:
    def __init__(self,
        root_dir: str = theConfig.data_dir
            ):
        self.root_dir:str = root_dir
    
    def list_dir(self, user_hash: str, password_hash:str):
        return os.listdir(self.__get_file_path(user_hash, password_hash))
    

    def is_exist(self, user_hash: str, password_hash:str, file_name: str = None):
        if file_name is None:
            return os.path.isdir(self.__get_file_path(user_hash, password_hash))
        else:
            return os.path.isfile(self.__get_file_path(user_hash, password_hash, file_name))
    
    
    def create_file_byte(self, 
        user_hash: str, 
        password_hash:str, 
        filename: str, 
        content: bytes
            ) -> bool:
        try:
            with open(self.__get_file_path(user_hash, password_hash, filename), "wb") as f:
                f.write(content)
        except Exception:
            return False
        return True

    def create_user(self, user_hash, password_hash):
        if self.is_exist(user_hash, password_hash):
            raise ErrorObject(ErrorTypeEnum.USER_REGISTRATED)
        dir_name = self.__get_file_path(user_hash, password_hash)
        os.mkdir(dir_name)
        return True

    
    def __get_dir_name(self, user_hash, passhare):
        return SHA256Salty(theConfig.server_salt).string(user_hash+passhare)
    
    def __get_file_path(self, user_hash: str, password_hash:str, file_name: str = None):
        user_dir = self.__get_dir_name(user_hash, password_hash)
        path = self.root_dir + "/" + user_dir
        if file_name is not None:
            path += "/" + file_name
        return path
