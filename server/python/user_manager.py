#!/usr/bin/env python3

import sys
if sys.version_info.major != 3:
    print("please use python3")

import os
import sqlite3

class DatabaseManager:
    def __init__(self,
        db: sqlite3.Connection, 
        cursor: sqlite3.Cursor
            ):
        self.db: sqlite3.Connection = db
        self.cursor: sqlite3.Cursor = cursor
    
    
    def create_user(self,
        username: str, # encrypted
        password: str, # encrypted
        email: str = None # not encrypted
            ) -> bool:
        res = self.cursor.execute('''INSERT INTO users(username, password, email) 
            SELECT ?, ?, ? 
            WHERE NOT EXISTS(SELECT 1 FROM users WHERE username = ?)''',(username, password, email, username) )
        self.db.commit()
        return 1 == res.rowcount


    def login(self,
        username:str, # encrypted
        password:str # encrypted
            ) -> bool:
        res = self.cursor.execute('''SELECT COUNT(*) FROM users WHERE username = ? AND password = ?''', (username, password))
        return 1 == res.fetchone()[0]

    
    def delete_user(self,
        username:str,
        password:str
            ) -> bool:
        res = self.cursor.execute("DELETE FROM users WHERE username = ? AND password = ?",(username, password) )
        if 1 == res.rowcount:
            self.db.commit()
            return True
        return False
    
    
    def update_password(self,
        username: str, # encrypted
        old_password: str, # encrypted
        new_password: str # encrypted
            ) -> bool:
        res = self.cursor.execute("UPDATE users SET password = ? WHERE username = ? AND password = ?", (new_password, username, old_password) )
        if 1 == res.rowcount:
            self.db.commit()
            return True
        return False

class DatabaseManagerFactory:
    @staticmethod
    def createEmptyDatabase(filename: str) -> DatabaseManager:
        if os.path.isfile(filename):
            return None
        db:sqlite3.Connection = sqlite3.connect(filename)
        cursor = db.cursor()
        cursor.execute('''CREATE TABLE users
             (username text, password text, email text)''')
        db.commit()
        return DatabaseManager(db, cursor)
    
    
    @staticmethod
    def loadDatabase(filename: str) -> DatabaseManager:
        if not os.path.isfile(filename):
            return None
        db = sqlite3.connect(filename)
        cursor = db.cursor()
        return DatabaseManager(db, cursor)
    
    

class FileManager:
    def __init__(self,
        db_manager: DatabaseManager,
        root_dir: str
            ):
        self.root_dir:str = root_dir
        self.db_manager: DatabaseManager = db_manager
    
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



db : DatabaseManager = None

if '__main__' == __name__:
    factory_type: str = sys.argv[1] if len(sys.argv) >= 2 else "load"
    db_name: str = sys.argv[2] if len(sys.argv) >= 3 else "example.db"
    if "create_empty" == factory_type:
        db = DatabaseManagerFactory.createEmptyDatabase(db_name)
    elif "load" == factory_type:
        db = DatabaseManagerFactory.loadDatabase(db_name)
    else:
        print("the first argument is factory_type it could be 'load' or 'create_empty' the second is the database path")
