import sys
if sys.version_info.major != 3:
    print("please use python3")

import os
import unittest
from data_manager.file_manager import FileManager
from config import theConfig
import time

class TestFileManager(unittest.TestCase):
    
    def __init__(self, *args, **kwargs):
        super(TestFileManager, self).__init__(*args, **kwargs)
        

    def create_dir(self, name):
        now = time.strftime("%Y%m%d_%H%M%S")
        dir_path:str =  "{}/file_manager_{}".format(theConfig.test_dir, now)
        self.dir_path = dir_path
        os.makedirs(dir_path, exist_ok=True)
    
    def test_get_file_path(self):
        fm = FileManager("apple")

        user_path = fm.get_file_path("monkey")
        self.assertEqual(user_path, "apple/monkey")
        
        user_path = fm.get_file_path("table")
        self.assertEqual(user_path, "apple/table")
        
        user_path = fm.get_file_path("monkey", "table")
        self.assertEqual(user_path, "apple/monkey/table")
        
        user_path = fm.get_file_path("monkey", "there")
        self.assertEqual(user_path, "apple/monkey/there")
        
        
