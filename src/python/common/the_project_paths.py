"""
The most important paths for this project
"""
import pathlib
import os
from .singleton import Singleton

class TheProjectPaths(metaclass=Singleton):
    """
    The most important paths for this project
    """
    def __init__(self):
        self.dir_project = pathlib.Path(os.path.abspath(
            pathlib.Path(__file__).parent.absolute().joinpath("../../..")))
        self.dir_src = self.dir_project.joinpath("./src")
        self.dir_web = self.dir_src.joinpath("./web")
        self.dir_python = self.dir_src.joinpath("./python")

THE_PROJECT_PATHS = TheProjectPaths()
