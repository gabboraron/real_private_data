"""
    Create csv file from config to doc/config.csv
"""
#!/usr/bin/env python3

from config.tools import configToCSV
from common.the_project_paths import THE_PROJECT_PATHS

if __name__ == '__main__':
    CSV_FILE = THE_PROJECT_PATHS.dir_project.joinpath("doc/config.csv")
    configToCSV(CSV_FILE)
