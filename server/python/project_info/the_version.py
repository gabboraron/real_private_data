"""
    This singleton contains version informations
"""
from pygit2 import Repository
from .the_project_paths import TheProjectPaths
#FIXME:version.py:11:4: R0903: Too few public methods (0/2) (too-few-public-methods)
#FIXME:version.py:7:0: R0903: Too few public methods (1/2) (too-few-public-methods)
class TheVersion:
    """
        This singleton contains version informations
    """
    class _TheVersion:
        def __init__(self):
            tpp = TheProjectPaths()
            root_dir = str(tpp.project_root_dir)
            repo = Repository(root_dir)
            self.commit = repo.head
            self.version = "0.0.1"
    instance = None
    def __init__(self):
        if not TheVersion.instance:
            TheVersion.instance = TheVersion._TheVersion()
    def __getattr__(self, name):
        return getattr(self.instance, name)
