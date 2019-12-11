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
