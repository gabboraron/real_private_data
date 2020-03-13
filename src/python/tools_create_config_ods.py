"""
    Create ODS file from config to doc/config.ods
"""
#!/usr/bin/env python3

from config.tools import configToOds
from common.the_project_paths import THE_PROJECT_PATHS

if __name__ == '__main__':
    ODS_FILE = THE_PROJECT_PATHS.dir_project.joinpath("doc/config.ods")
    configToOds(ODS_FILE)
