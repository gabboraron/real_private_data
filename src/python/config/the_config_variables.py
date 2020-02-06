"""
variables for config
you can write {{variable_name}} and it will replace it
"""
from common.singleton import Singleton
from common.the_project_paths import THE_PROJECT_PATHS

class TheConfigVariables(metaclass=Singleton):
    """
    variables for config
    you can write {{variable_name}} and it will replace it
    """
    def __init__(self):
        self.dir_project = str(THE_PROJECT_PATHS.dir_project)
        self.dir_src = str(THE_PROJECT_PATHS.dir_src)
        self.dir_web = str(THE_PROJECT_PATHS.dir_web)
        self.dir_python = str(THE_PROJECT_PATHS.dir_python)

THE_CONFIG_VARIABLES = TheConfigVariables()