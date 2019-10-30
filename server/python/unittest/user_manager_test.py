import sys
if sys.version_info.major != 3:
    print("please use python3")

sys.path.insert(0,'../')
import os
import shutil
import unittest

import user_manager

class TestUserManager(unittest.TestCase):
    
    def __init__(self, *args, **kwargs):
        super(TestUserManager, self).__init__(*args, **kwargs)
        dir_path:str = "/var/tmp/suer_manager_test" 
        if "dir_path" in kwargs:
            dir_path = kwargs["dir_path"]  
        self.dir_path = dir_path
        os.makedirs(dir_path, exist_ok=True)
        shutil.rmtree(dir_path)
        os.makedirs(dir_path, exist_ok=True)


    def test_create_empty_database(self):
        empty_db = user_manager.DatabaseManagerFactory.createEmptyDatabase(self.dir_path + "/empty_db.db")
        self.assertIsNotNone(empty_db)


    def test_create_exist_db(self):
        db = user_manager.DatabaseManagerFactory.createEmptyDatabase(self.dir_path + "/empty_db2.db")
        self.assertIsNotNone(db)
        db2 = user_manager.DatabaseManagerFactory.createEmptyDatabase(self.dir_path + "/empty_db2.db")
        self.assertIsNone(db2)

    def test_load_database(self):
        db_path:str = self.dir_path + "/db_for_load.db"
        db = user_manager.DatabaseManagerFactory.createEmptyDatabase(db_path)
        self.assertIsNotNone(db)
        loaded_db = user_manager.DatabaseManagerFactory.loadDatabase(db_path)
        self.assertIsNotNone(loaded_db, "Db can't loaded")
    

    def test_load_not_exist_database(self):
        db_path:str = self.dir_path + "/alfkdsasdfklasdfasf.db"
        db = user_manager.DatabaseManagerFactory.loadDatabase(db_path)
        self.assertIsNone(db)


    def test_create_user(self):
        db = user_manager.DatabaseManagerFactory.createEmptyDatabase(self.dir_path + "/create_user.db")
        self.assertIsNotNone(db, "Db is not created")
        self.assertTrue(db.create_user("user1", "password1"),
            "User is not created")
        
        self.assertFalse(db.create_user("user1", "password1"),
            "User created 2 times")



if __name__ == '__main__':
    unittest.main()