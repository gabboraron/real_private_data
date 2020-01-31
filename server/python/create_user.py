#!/usr/bin/env python3
import sys
import getpass
from data_manager.file_manager import FileManager
from sha256Salty.sha256Salty import SHA256Salty
from config import theConfig

if sys.version_info.major != 3:
    print("please use python3")

def hash(s:str):
    return SHA256Salty(theConfig.salt).string(s)

def create_user(username, password):
    user_hash = hash(username)
    pass_hash = hash(password)
    fm = FileManager()
    
    try:
        fm.create_user(user_hash, pass_hash)
        print("Registration was successfully")
    except Exception as e:
        print(e)
    

if __name__ == "__main__":
    username  = input("Enter your username: ")
    password  = getpass.getpass("Enter your password: ")
    password2 = getpass.getpass("Enter your password again :")
    if username == "" or password == "":
        print("Username and/or password is empty")
        exit()
    if password != password2:
        print("password and password again is not equal")
        exit()
    create_user(username, password)