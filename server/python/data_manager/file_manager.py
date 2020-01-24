#!/usr/bin/env python3

import sys
from config import theConfig

if sys.version_info.major != 3:
    print("please use python3")

import os

class FileManager:
    def __init__(self,
        root_dir: str = theConfig.data_dir
            ):
        self.root_dir:str = root_dir
    
    def get_file_path(self, user_dir:str, file:str = None):
        path = self.root_dir + "/" + user_dir
        if file is not None:
            path += "/" + file
        return path

    def list_dir(self, user_dir: str):
        return os.listdir(self.get_file_path(user_dir))
    

    def is_exist(self, user_dir: str, file_name: str = None):
        if file_name is None:
            return os.path.isdir(self.get_file_path(user_dir))
        else:
            return os.path.isfile(self.get_file_path(user_dir, file_name))
    
    
    def create_file_byte(self, 
        user_dir: str, 
        filename: str, 
        content: bytes
            ) -> bool:
        try:
            with open(self.get_file_path(user_dir, filename), "wb") as f:
                f.write(content)
        except Exception:
            return False
        return True

    