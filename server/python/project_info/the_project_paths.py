"""
        This singleton contains each important paths
"""
import os
import pathlib

#FIXME pylint the_project_paths.py:12:4:R0903: Too few public methods (0/2) (too-few-public-methods)
#FIXME the_project_paths.py:8:0: R0903: Too few public methods (1/2) (too-few-public-methods)
class TheProjectPaths:
    """
        This singleton contains each important paths
    """
    class _TheProjectPaths:
        def __init__(self):
            curr_dir = os.path.dirname(__file__)
            self.project_root_dir = pathlib.Path(curr_dir).joinpath("../../..").absolute()
            self.doc_dir = self.project_root_dir.joinpath("./doc")
    instance = None
    def __init__(self):
        if not TheProjectPaths.instance:
            TheProjectPaths.instance = TheProjectPaths._TheProjectPaths()
    def __getattr__(self, name):
        return getattr(self.instance, name)
