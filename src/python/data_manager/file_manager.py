#!/usr/bin/env python3
import sys
import os

from config import theConfig
from sha256Salty.sha256Salty import SHA256Salty
from error_object.error_object import ErrorObject
from error_object.error_type_enum import ErrorTypeEnum

if sys.version_info.major != 3:
    print("please use python3")

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
        file_name: str, 
        content: bytes,
        is_new:bool = False
            ) -> bool:
        is_exist = self.is_exist(user_hash, password_hash, file_name)
        if is_new and is_exist:
            raise Exception("TODO: ERROR_OBJECT File has been already exist")
        elif not is_new and not is_exist:
            raise Exception("TODO: ERROR_OBJECT File not exist")

        try:
            with open(self.__get_file_path(user_hash, password_hash, file_name), "wb") as f:
                f.write(bytes(content))
        except Exception as e:
            raise e # TODO: error object
        return True

    
    def create_user(self, user_hash, password_hash):
        if self.is_exist(user_hash, password_hash):
            raise ErrorObject(ErrorTypeEnum.USER_REGISTRATED)
        dir_name = self.__get_file_path(user_hash, password_hash)
        os.mkdir(dir_name)
        return True

    
    def open_file(self, user_hash, password_hash, file_name):
        if not self.is_exist(user_hash, password_hash, file_name):
            raise Exception("TODO: error object: File not exist")
        with open(self.__get_file_path(user_hash, password_hash, file_name), "rb") as f:
            ret = f.read()
            return ret


    def rename_file(self, user_hash, password_hash, old_name, new_name):
        if not self.is_exist(user_hash, password_hash, old_name):
            raise Exception("TODO: some exception")
        old_path = self.__get_file_path(user_hash, password_hash, old_name)
        new_path = self.__get_file_path(user_hash, password_hash, new_name)
        os.rename(old_path, new_path)
        return True
    
    
    def del_file(self, user_hash, password_hash, file_name):
        if not self.is_exist(user_hash, password_hash, file_name):
            raise Exception("TODO: error object: File not exist")
        os.remove(self.__get_file_path(user_hash, password_hash, file_name))
        return True
    
    
    def change_password(self, old_user_hash, old_password_hash, new_user_hash, new_password_hash, files):
        # files = [{"old":"old_name","new":"new_name"}]
        # TODO: Transaction
        if not self.is_exist(old_user_hash, old_password_hash):
            raise ErrorObject(ErrorTypeEnum.BAD_USERNAME_PASSWORD)
        if self.is_exist(new_user_hash, new_password_hash):
            raise Exception("New user has been already exist")

        old_path = self.__get_file_path(old_user_hash, old_password_hash)
        new_path = self.__get_file_path(new_user_hash, new_password_hash)
        old_files = [self.__real_file_name(f["old"]) for f in files]
        old_files.sort()
        curr_files = self.list_dir(old_user_hash, old_password_hash)
        curr_files.sort()
        if old_files != curr_files:
            raise Exception("TODO: file list is not equal with current files")
        
        os.mkdir(new_path)
        for f in files:
            old_f = self.__get_file_path(old_user_hash, old_password_hash, f["old"])
            new_f = self.__get_file_path(new_user_hash, new_password_hash, f["new"])
            os.rename(old_f, new_f)
        os.removedirs(old_path)

    def __get_dir_name(self, user_hash, passhare):
        return SHA256Salty(theConfig.server_salt).string(user_hash+passhare)
    
    def __get_file_path(self, user_hash: str, password_hash:str, file_name: str = None):
        user_dir = self.__get_dir_name(user_hash, password_hash)
        # not important, __get_dir_name has to be [00-ff] string
        user_dir = self.__real_file_name(user_dir)
        path = self.root_dir + "/" + user_dir
        if file_name is not None:
            file_name = self.__real_file_name(file_name)
            path += "/" + file_name
        return path


    def __real_file_name(self, file_name: str):
        return file_name.replace("/","_slash_").replace("\\","_backslash_")