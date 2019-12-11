#!/usr/bin/env python3

import sys
if sys.version_info.major != 3:
    print("please use python3")

import os
import sqlite3

class FileManager:
    def __init__(self,
        root_dir: str
            ):
        self.root_dir:str = root_dir
    
    def __get_file_name(self, user_name:str, file:str = None):
        path = self.root_dir + "/" + user_name
        if file is not None:
            path += "/" + file
        return path

    def list_dir(self, user_name: str):
        return os.listdir(self.__get_file_name(user_name))
    

    def is_exist(self, user_name: str, file_name: str):
        return os.path.isfile(self.__get_file_name(user_name, file_name))
    
    
    def create_file(self, 
        user_name: str, 
        filename: str, 
        content: str
            ) -> bool:
        try:
            with open(self.__get_file_name(user_name, filename), "w") as f:
                f.write(content)
        except Exception:
            return False
        return True