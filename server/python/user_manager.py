import sqlite3
import os
import sys

class DatabaseManager:
    def __init__(self, db, cursor: sqlite3.Cursor):
        self.db = db
        self.cursor : sqlite3.Cursor = cursor
    
    
    def create_user(self, username, password, email = None) -> bool:
        res = self.cursor.execute('''INSERT INTO users(username, password, email) 
            SELECT ?, ?, ? 
            WHERE NOT EXISTS(SELECT 1 FROM users WHERE username = ?)''',(username, password, email, username) )
        self.db.commit()
        return 1 == res.rowcount


    def login(self, username, password) -> bool:
        res = self.cursor.execute('''SELECT COUNT(*) FROM users WHERE username = ? AND password = ?''', (username, password))
        return 1 == res.fetchone()[0]

    
    def delete_user(self, username, password) -> bool:
        res = self.cursor.execute("DELETE FROM users WHERE username = ? AND password = ?",(username, password) )
        if 1 == res.rowcount:
            self.db.commit()
            return True
        return False
    
    
    def update_password(self, username, old_password, new_password) -> bool:
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
        db = sqlite3.connect(filename)
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
    
    

db : DatabaseManager = None

if '__main__' == __name__:
    factory_type = sys.argv[1]
    db_name = sys.argv[2]
    if "create_empty" == factory_type:
        db = DatabaseManagerFactory.createEmptyDatabase(db_name)
    elif "load" == factory_type:
        db = DatabaseManagerFactory.loadDatabase(db_name)
    else:
        print("the first argument is factory_type it could be 'load' or 'create_empty' the second is the database path")
