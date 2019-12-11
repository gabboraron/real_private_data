#!/usr/bin/env python3

import sys
if sys.version_info.major != 3:
    print("please use python3")

import os
import sqlite3
from .database_manager import DatabaseManager

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


# TODO: make a test for it.
"""
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
"""