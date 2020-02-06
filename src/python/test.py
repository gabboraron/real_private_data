#!/usr/bin/env python3
import sys
import unittest
if sys.version_info.major != 3:
    print("please use python3")

import os
from config import theConfig
import time
from tests.data_manager.test_file_manager import TestFileManager

if __name__ == '__main__':
    test_dir = theConfig.test_dir + "/" + time.strftime("%Y%m%d_%H%M%S")
    os.makedirs(test_dir, exist_ok=True)
    unittest.main()